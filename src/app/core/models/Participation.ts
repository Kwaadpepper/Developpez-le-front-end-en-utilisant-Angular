/**
 * Data incomming from a web service
 *
 *    example of participation:
 *
 *    {
 *        id: 1,
 *        year: 2012,
 *        city: "Londres",
 *        medalsCount: 28,
 *        athleteCount: 372
 *    }
 */
export default interface Participation {
  id: number
  year: number
  city: string
  medalsCount: number
  atheleteCount: number
}
