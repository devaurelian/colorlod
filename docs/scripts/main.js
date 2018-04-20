/*
 *  Colorlod. Copyright (c) 2018 HWALab. MIT License.
 *  https://www.hwalab.com/colorlod/
 */

/* eslint-disable max-statements, no-console, require-jsdoc */

import * as utils from "/scripts/utils.js";

const [computedElem, ratioElem, lodElem] = document.querySelectorAll("#computed, #ratio, #lod");

const wrapEl = document.getElementById("wrap");
const colorInputEl = document.getElementById("colorInput");
const resultEl = document.getElementById("result"),
    errorEl = document.getElementById("error");


const curWCAGContrast = utils.contrastRatios.AA_LARGE;

console.log(computedElem);

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
        // Calculate the contrast between the current color and white
        let contrast = utils.getContrastRatio(compRGB, utils.whiteRGB);

        // Check whether a light or a dark contrast color should be used
        const useLight = contrast >= curWCAGContrast;

        // Update the text color with the light (white) or dark (black) color
        wrapEl.style.color = useLight ? "white" : "black";

        // If a darker foreground color should be used, update the contrast with black
        if (!useLight) contrast = utils.getContrastRatio(compRGB, utils.blackRGB);

        // Update the computed, contrast, and lod information
        computedElem.textContent = compColorString;
        ratioElem.textContent = `${contrast.toFixed(2)}:1`;
        lodElem.textContent = useLight ? "light" : "dark";
    } else {
        setTransparent();
    }

    resultEl.classList.toggle("invisible", !compRGB);
    errorEl.classList.toggle("invisible", compRGB);
});
