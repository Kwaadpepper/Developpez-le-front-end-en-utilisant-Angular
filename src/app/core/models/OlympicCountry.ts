import Participation from "./Participation";

/**
 * Data incomming from a web service
 *
 *    example of participation:
 *
 *    {
 *        id: 1,
 *        country: "Italy",
 *        city: "Londres",
 *        participations: []
 *    }
 */
export default interface OlympicCountry {
  id: number;
  country: string;
  participations: Array<Participation>
}
