### Template for playable ad with Three.js and Blacksmith2D
### https://threejs.org/docs/
### https://blacksmith2d.io/Docs

### Uses Node v14

### Guide:
Intall packages
```sh
npm run i
```
Run in dev mode
```sh
npm run dev
```
Build single platform
```sh
npm run build
```
Build all platforms
```sh
node autobuilder.js
```

To build version for the dashboard, go to src/js/data/configurable_params.js
Clear or comment all the imports, replace data field with "add_json"
Dont forget so save data somewhere else to make a json file for the dashboard
```js
static data = 'add_json';
```