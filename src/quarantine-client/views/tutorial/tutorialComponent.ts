/**
 * Interface for components which are part of the tutorial and should not be displayed from the beginning.
 * Offers two methods: activateComponent() and hideComponent().
 * @author Marvin Kruber
 */
export interface TutorialComponent {
    /** Activates/displays the component. */
    activateComponent(): void;

    /** Hides the component. */
    hideComponent(): void;
}