/*
 *  Colorlod. Copyright (c) 2018 HWALab. MIT License.
 *  https://www.hwalab.com/colorlod/
 */

/* eslint-disable max-statements, no-console, require-jsdoc */

import * as utils from "/scripts/utils.js";

const [computedElem, ratioElem, lodElem] = document.querySelectorAll("#computed, #ratio, #lod");

const colorInputEl = document.getElementById("colorInput");
const resultEl = document.getElementById("result");
const errorEl = document.getElementById("error");
const themeColorEl = document.querySelector("meta[name=theme-color]");

let curWCAGContrast = utils.contrastRatios.AA_LARGE;
let compRGB = {};

function setTransparent() {
    document.body.style.backgroundColor = "transparent";
    document.body.classList.remove("body--light");

}

function updateContrast() {
    // Calculate the contrast between the current color and white
    let contrast = utils.getContrastRatio(compRGB, utils.whiteRGB);

    // Check whether a light or a dark contrast color should be used
    const useLight = contrast >= curWCAGContrast;

    // Update the text color with the light (white) or dark (black) color
    document.body.classList.toggle("body--light", useLight);

    // If a darker foreground color should be used, update the contrast with black
    if (!useLight) contrast = utils.getContrastRatio(compRGB, utils.blackRGB);

    // Update the computed, contrast, and lod information
    ratioElem.textContent = `${contrast.toFixed(2)}:1`;
    ratioElem.dataset.pass = contrast >= curWCAGContrast;
    lodElem.textContent = useLight ? "light" : "dark";
}

colorInputEl.addEventListener("input", () => {

    setTransparent();
    document.body.style.backgroundColor = colorInputEl.value;

    const compColorString = window.getComputedStyle(document.body).getPropertyValue("background-color");
    console.log("Computed background-color", compColorString);
    compRGB = utils.parseComputedRGBColor(compColorString);
    console.log("Computed RGB", compRGB);

    if (compRGB) {
        computedElem.textContent = compColorString;
        updateContrast();
    } else {
        setTransparent();
    }

    document.body.classList.toggle("checkered", !compRGB);

    // Update the theme-color meta tag to update the browser toolbar color (on browsers that support this feature)
    themeColorEl.setAttribute("content", compRGB ? compColorString : "");

    resultEl.classList.toggle("invisible", !compRGB);
    errorEl.classList.toggle("invisible", compRGB);
});

document.getElementById("optionsBar").addEventListener("click", event => {
    if (event.target.tagName.toUpperCase() === "BUTTON") {
        const button = event.target;

        // Clear the "on" flag on all buttons
        [...button.parentNode.children].forEach(btn => delete btn.dataset.on);

        // Turn "on" the clicked button
        button.dataset.on = true;

        // Update the current WCAG contrast and recalculate and display current contrast information
        curWCAGContrast = utils.contrastRatios[button.dataset.contrast];
        updateContrast();
    }
});
