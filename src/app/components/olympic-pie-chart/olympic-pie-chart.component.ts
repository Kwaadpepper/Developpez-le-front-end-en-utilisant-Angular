import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Color, DataItem, LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import OlympicCountry from 'src/app/core/models/OlympicCountry';

@Component({
  selector: 'olympic-pie-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './olympic-pie-chart.component.html',
  styleUrl: './olympic-pie-chart.component.scss',
})

/** NGX PieChartComponent wrapper */
export class OlympicPieChartComponent implements OnInit, OnChanges {
  @Input({ required: true }) olympicCountries: Array<OlympicCountry> = [];

  // NGX inputs
  single: DataItem[] = [
    {
      "name": "No Data",
      "value": 0,
    }
  ];
  view: [number, number] = [700, 400];

  // NGX options
  gradient: boolean = true;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Below;
  colorScheme: Color | string = "cool";
  ngOnInit(): void {
    this.updatePieChartData(this.olympicCountries);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["olympicCountries"]) {
      this.updatePieChartData(changes["olympicCountries"].currentValue);
    }
  }

  onSelect(data: DataItem): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  private updatePieChartData(olympicCountries: typeof this.olympicCountries): void {
    this.single = [];
    olympicCountries.forEach(olympicCountry => this.single.push({
      name: olympicCountry.country,
      value: olympicCountry.participations
        .map(participation => participation.medalsCount)
        .reduce((prev, curr) => prev + curr)
    }));
  }
}
