import { loadEventCard } from "../cards-management.js";
import { loadEffect } from "./effect.js";

function eventTest(scene) {
    console.log("obtain event card");
    if (scene.currentEvent == 0) {
        scene.currentEvent = scene.eventCards[scene.stage].pop().id;
        scene.currentEventBox.setText(scene.currentEvent);
        scene.eventBox.setVisible(false);
        scene.currentEventImage.setTexture(scene.currentEvent).setVisible(true);
        console.log(scene.currentEvent);
        scene.tempButton.setAlpha(0.01).setScale(0.18, 0.45);
        scene.tempText.setText('');
    }
}

function useEffect(scene) {
    console.log("use event card");
    if (scene.currentEvent != 0) {
        loadEffect(scene.currentEventBox);
        scene.currentEvent = 0;
        scene.currentEventBox.setText('0');
        scene.eventBox.setVisible(true);
        scene.currentEventImage.setVisible(false);
        scene.tempText.setText('Pick card');
        scene.tempButton.setScale(0.13, 0.08);
    }
}

export { eventTest, useEffect };