import { GuiScene } from "./scenes/gui-scene";

/**
 * Abstract class of a gui element which is part of the GuiScene.
 * @author Sebastian Führ
 * @see GuiScene
 */
export abstract class GuiElement {

    /** The GuiScene where the element belongs to */
    protected scene: GuiScene;
    /** The scale an object should adapt to when hovered over */
    protected scaling = 1.1;

    constructor(scene: GuiScene) {
        this.scene = scene;
    }

    /** Create and add an instance of the element to the GuiScene */
    public abstract create(): GuiElement;
}