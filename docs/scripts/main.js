/*
 *  Colorlod. Copyright (c) 2018 HWALab. MIT License.
 *  https://www.hwalab.com/colorlod/
 */

/* eslint-disable max-statements, no-console, require-jsdoc */

import * as utils from "/scripts/utils.js";

const wrapEl = document.getElementById("wrap");
const colorInputEl = document.getElementById("colorInput");
const resultEl = document.getElementById("result");
console.log(colorInputEl);

function setTransparent() {
    wrapEl.style.backgroundColor = "transparent";
    wrapEl.style.color = "black";
}

colorInputEl.addEventListener("input", event => {

    setTransparent();
    wrapEl.style.backgroundColor = colorInputEl.value;

    const compColorString = window.getComputedStyle(wrapEl).getPropertyValue("background-color");
    console.log("Computed background-color", compColorString);
    const compRGB = utils.parseComputedRGBColor(compColorString);
    console.log("Computed RGB", compRGB);

    if (compRGB) {
        const contrast = utils.getContrastForColor(compRGB);
        // const useLight = utils.shouldUseLightForegroundOnBackground(compRGB);
        const useLight = contrast >= 3;

        wrapEl.style.color = useLight ? "white" : "black";

        resultEl.innerText = `Computed color is ${compColorString}.\nContrast with white is ${contrast}.
        You should use a ${useLight ? "light" : "dark"} contrast color`;
    } else {
        setTransparent();
        resultEl.innerText = "Invalid";
    }
});
