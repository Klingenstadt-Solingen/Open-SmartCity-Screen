{
  description = "Solingen-Digital-Signage";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        inherit (pkgs) stdenv;
        inherit (nixpkgs.lib) optionals;
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs-18_x
            python3
            nodePackages.yarn
            pkg-config
          ] ++ optionals stdenv.isDarwin [
            xcbuild
            darwin.apple_sdk.frameworks.CoreFoundation
            darwin.apple_sdk.frameworks.CoreServices
          ];
        };

        shellHook = ''
        '';
      });
}

