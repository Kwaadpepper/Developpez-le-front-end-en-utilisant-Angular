# OlympicGamesStarter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

Don't forget to install your node_modules before starting (`npm install`).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Where to start

As you can see, an architecture has already been defined for the project. It is just a suggestion, you can choose to use your own. The predefined architecture includes (in addition to the default angular architecture) the following:

- `components` folder: contains every reusable components
- `pages` folder: contains components used for routing
- `core` folder: contains the business logic (`services` and `models` folders)

I suggest you to start by understanding this starter code. Pay an extra attention to the `app-routing.module.ts` and the `olympic.service.ts`.

Once mastered, you should continue by creating the typescript interfaces inside the `models` folder. As you can see I already created two files corresponding to the data included inside the `olympic.json`. With your interfaces, improve the code by replacing every `any` by the corresponding interface.

You're now ready to implement the requested features.

Good luck!

## Configuration

### Compatibilité avec les navigateurs

- [Audience coverage: 88.8 %](https://browsersl.ist/#q=%3E0.3%25%2C+last+2+Chrome+versions%2C+last+1+Firefox+version%2C+last+2+Edge+major+versions%2C+last+2+Safari+major+versions%2C+last+2+iOS+major+versions%2C+Firefox+ESR%2C+not+dead)

## TODO

- Pas de switch, un seul graphique par page
- Utiliser Observable , BehaviorSubject.
- Styler et responsive
