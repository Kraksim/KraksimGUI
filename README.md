<h1 align="center">Kraksim</h1>
<p align="center">

<img src="https://img.shields.io/badge/Typescript-darkred" />
<img src="https://img.shields.io/badge/MUI_material-blue" />
<img src="https://img.shields.io/badge/Reduxjs_toolkit-lightgrey" />
<img src="https://img.shields.io/badge/react--vis-green" />
<img src="https://img.shields.io/badge/formik-blueviolet" />
<img src="https://img.shields.io/badge/react--vis--graph--wrapper-red" />
<br/>


Kraksim is an environment for modeling and optimisation of road traffic. It gives you possibility to create maps and simulations and to collect the data about road traffic. You can also view and compare results of different simulations which take place on the same map.


Project was a part of Bachelor's degree thesis written in Polish, which can be red [here](docs/Bachelor's_degree_thesis.pdf)

Backend can be found [here](https://github.com/Kraksim/Kraksim)
 
<br/>
<br/>
<br/>
<p align="center">
 
<a href="https://kraksim.vercel.app/">
<img src="docs/map-list-view.png" alt="" data-canonical-src="docs/map-list-view.png" width="87.5%" height="87.5%" />
<img src="docs/create-map.png" alt="" data-canonical-src="docs/map-list-view.png" width="87.5%" height="87.5%" />
<img src="docs/simulations-table-view.png" alt="" data-canonical-src="docs/map-list-view.png" width="87.5%" height="87.5%" />
<img src="docs/statictics-compare.png" alt="" data-canonical-src="docs/map-list-view.png" width="87.5%" height="87.5%" />

</a>
</p>


### Setup

Use `nvm` for managing node versions (https://tecadmin.net/install-nvm-macos-with-homebrew/)

run `nvm install` to switch to appropriate npm version

### Running 

Set environment variable with link to backend instance, e.g. 
#### `export REACT_APP_API_URL=http://localhost:8081/`

then run 

#### `yarn start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
