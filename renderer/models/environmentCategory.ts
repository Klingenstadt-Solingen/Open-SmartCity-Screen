import { File, Relation } from 'parse'
import { Base } from './base'
import { EnvironmentSubCategory } from './environmentSubCategory'

export interface EnvironmentCategory extends Base {
  name: string
  color: string
  order: number
  subCategories: Relation<Parse.Object<EnvironmentSubCategory>>
  icon: File
}
