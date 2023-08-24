import { MeshPhongMaterial, NormalBlending, Cache, DoubleSide } from "three";
import TWEEN from "@tweenjs/tween.js";
import Helpers from "../../helpers/helpers";

export default class MaterialLoader {
    constructor(asset) {
        this._asset = asset;

        this._init()
    }
    _initClayMaterial(clayMaterial) {
        this._asset.traverse((child) => {
            const childName = child.name.toLowerCase();
            if (childName.includes("ear") && !childName.includes("ring") || childName.startsWith("h_") && !childName.includes("hair") && !childName === "h_mask") { child.material = clayMaterial }
            if (child.material === this.skinMaterial && child.material.color !== clayMaterial.color) {
                child.material.color.copy(clayMaterial.color);
            }
        })
    }

    _init() {
        const whiteMaterial = new MeshPhongMaterial({
            color: 0xffffff, side: DoubleSide,
        })
        const blackMaterial = new MeshPhongMaterial({ color: 0x000000 })
        this.skinMaterial = new MeshPhongMaterial({
            color: 0xF5F5DC, blending: NormalBlending, side: DoubleSide,

        })
        const goldMaterial = new MeshPhongMaterial({ color: 0xFFD700 })

        this._asset.traverse((child) => {
            const childName = child.name.toLowerCase()
            child.material.side = DoubleSide;
            if (childName === "b_big") {
                child.children[0].material = blackMaterial;
                child.children[1].material = this.skinMaterial;
                child.children[2].material = whiteMaterial;
            }
            if (childName === "b_bride") {

                child.children[0].material = this.skinMaterial;
                child.children[1].material = whiteMaterial;

            }
            if (childName === "b_harley") { child.material = new MeshPhongMaterial({ map: Cache.get("harleybody") }) }
            if (childName === "b_tuxedo") {
                child.children[0].material = blackMaterial;
                child.children[1].material = this.skinMaterial;
                child.children[2].material = whiteMaterial;

            }

            if (childName === "h_harley") { child.material = new MeshPhongMaterial({ map: Cache.get("harleyhead") }) }
            if (childName === "h_tuxedo") { child.material = new MeshPhongMaterial({ map: Cache.get("mrbeanhead") }) }
            if (childName === "h_bride") { child.material = new MeshPhongMaterial({ map: Cache.get("arianagrandehead") }) }
            if (childName === "h_rock") { child.material = new MeshPhongMaterial({ map: Cache.get("rockhead") }) }

            if (childName === "Heads" || childName.includes("ear")) { child.material = whiteMaterial }

            if (childName.includes("eye")) {
                child.material = whiteMaterial.clone();
                child.material.map = Cache.get("arianagrandehead");
            }

            if (childName.includes("mask") || childName === "hair_clip" || childName === "h_mask") { child.material = whiteMaterial; }
            if (childName.includes("ring")) { child.material = goldMaterial }

            if (childName.includes("hair") || childName === "moustache") { child.material = new MeshPhongMaterial({ color: 0x664238 }) }

            if (childName === "glasses") { child.material = blackMaterial }

            if (childName === "spiderman") { child.material = new MeshPhongMaterial({ color: 0xff0000 }) }

            if (childName === "veil") { child.material = whiteMaterial }

            if (childName === "hair3") { child.material = new MeshPhongMaterial({ color: 0xfaf0be }) }

            if (childName === "Teeth") { child.material = whiteMaterial.clone(); child.material.map = Cache.get("harleyhead") }

        })
    }
}