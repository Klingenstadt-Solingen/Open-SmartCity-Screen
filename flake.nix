{
  description = "Solingen-Digital-Signage";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        project-node = pkgs.nodejs_20;
        project-yarn = pkgs.yarn.overrideAttrs (oldAttrs: rec {
          buildInputs = [ project-node ];
        });
        inherit (pkgs) stdenv;
        inherit (nixpkgs.lib) optionals;
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            project-node
            project-yarn
            python3
            pkg-config
          ] ++ optionals stdenv.isDarwin [
            xcbuild
            darwin.apple_sdk.frameworks.CoreFoundation
            darwin.apple_sdk.frameworks.CoreServices
          ];
        };
      });
}
