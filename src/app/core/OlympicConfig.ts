export default abstract class OlympicConfig {
  private static chartColors: Color[] = [
    '#a8385d',
    '#7aa3e5',
    '#a27ea8',
    '#aae3f5',
    '#adcded',
    '#a95963',
    '#8796c0',
    '#7ed3ed',
    '#50abcc',
    '#ad6886',
  ]

  public static getColors(): Color[] {
    return OlympicConfig.chartColors
  }
}
