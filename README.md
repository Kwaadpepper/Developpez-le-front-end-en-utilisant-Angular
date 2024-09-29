# OlympicGamesStarter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

## Build

## Prerequisites

- **node** version used for development `v20.17.0` (LTS/iron)
- **npm** version used `10.8.2`

### Development

1. Install dependencies `npm i`
2. Start the development server `npx ng serve` or `npx ng serve -c development`
3. Use a browser to access the url <http://localhost:4200/>

### Production

1. Run `npx ng serve -c production` to preview the production build
2. Or run `npx ng build` to get the compiled application in the `dist/` folder

## Configuration

### ESM optimization issue

It will potentially be addressed soon:
<https://github.com/apexcharts/apexcharts.js/pull/4691>

### Browser compatibility

- [Audience coverage: 88.8 %](https://browsersl.ist/#q=%3E0.3%25%2C+last+2+Chrome+versions%2C+last+1+Firefox+version%2C+last+2+Edge+major+versions%2C+last+2+Safari+major+versions%2C+last+2+iOS+major+versions%2C+Firefox+ESR%2C+not+dead)

### Mock data

<https://json-generator.com/>

    [
      '{{repeat(210)}}',
      {
        id: '{{index()}}',
        country: '{{country()}}',
        participations:[
          '{{repeat(45)}}',
          {
            id: '{{index()}}',
            year: '{{date(new Date(1886 + index() * 4, 0, 1), new Date(1886 + index() * 4, 0, 1), "YYYY") }}',
            city: '{{ city() }}',
            medalsCount: '{{integer(0, 140)}}',
            athleteCount: '{{integer(1, 720)}}'
          }
        ]
      }
    ]

#### Data values example

##### *JParis 2024 Olympics*

>Representing 203 National Olympic Committees (NOCs), approximately 10,500 athletes will compete across 32 sports in 329 events at the Games of the XXXIII Olympiad Paris 2024 from 26 July to 11 August.

*source :* <https://olympics.com/en/news/paris-2024-olympics-full-list-ioc-national-olympic-committee-codes>

## TODO

- Pas de switch, un seul graphique par page
- Utiliser Observable , BehaviorSubject.
- Styler et responsive
