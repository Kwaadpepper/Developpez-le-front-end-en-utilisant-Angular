import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Color, DataItem, LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import CanDisplayOlympicCountries from 'src/app/core/components/CanDisplayOlympicCountries';
import OlympicCountry from 'src/app/core/models/OlympicCountry';

interface OlympicDataItem extends DataItem {
  extra: {
    id: number
  }
}

@Component({
  selector: 'olympic-pie-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './olympic-pie-chart.component.html',
  styleUrl: './olympic-pie-chart.component.scss',
})

/** NGX PieChartComponent wrapper */
export class OlympicPieChartComponent extends CanDisplayOlympicCountries implements OnInit, OnChanges {
// NGX inputs
  single: OlympicDataItem[] = [
    {
      name: "No Data",
      value: 0,
      extra: {id: 0}
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

  onSelect(data: OlympicDataItem): void {
    const dataItemName = data.extra.id;
    this.selected.emit(this.getOlympicCountryFromId(dataItemName));
  }

  private updatePieChartData(olympicCountries: typeof this.olympicCountries): void {
    this.single = [];
    olympicCountries.forEach(olympicCountry => this.single.push({
      name: olympicCountry.country,
      label: olympicCountry.country,
      extra: {
        id: olympicCountry.id
      },
      value: olympicCountry.participations
        .map(participation => participation.medalsCount)
        .reduce((prev, curr) => prev + curr)
    }));
  }

  private getOlympicCountryFromId(id: number): OlympicCountry {
    const olympicCountry = this.olympicCountries.find(oC => oC.id === id);
    if (olympicCountry === undefined) {
      throw new Error(`Could not find olympic country id '${id}'`);
    }
    return olympicCountry;
  }
}
