import { EnvironmentSensorHistory } from '../../models/environmentSensorHistory'
import Parse from 'parse'

export const fetchSensorHistory = async (
  sensorId: string
): Promise<Array<EnvironmentSensorHistory>> => {
  try {
    const response: Array<Parse.Object<EnvironmentSensorHistory>> = await Parse.Cloud.run(
      'environmentSensorHistory',
      {
        refId: sensorId,
        limit: 10,
        skip: 0
      }
    )

    return response.map((r) => r.attributes)
  } catch (error) {
    console.error(error)
  }
}
