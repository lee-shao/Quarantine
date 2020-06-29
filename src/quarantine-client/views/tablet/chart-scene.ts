import * as Chart from "chart.js";
import "chartjs-plugin-zoom";
import "hammerjs";
import { TimeSubscriber } from "../../models/util/timeSubscriber";
import { TimeController } from "../../controller/timeController";
import { UpgradeController } from "../../controller/gui-controller/upgradeController";
import { Stats } from "../../controller/stats";
import { TutorialComponent } from "../tutorial/tutorialComponent";

/**
 * Scene for creating and updating the graphical
 * representation of infection numbers using Chart.js
 * @author Jakob Hartmann
 */
export class ChartScene extends Phaser.Scene implements TimeSubscriber, TutorialComponent {
    /** initial population */
    private initialInfected: number;

    /** initial amount of money */
    private initialMoney: number;

    /** Number of days since the game started */
    private day: number;

    /** Number of infected people */
    private infected: number;

    /** Chart to show the infection numbers */
    private chart;

    /** Number of days/data points to be displayed in the chart */
    private timeframe: number;

    /** Array with the labels to display each day on the x-axis of the chart */
    private labels: Array<string> = [];

    /** Array with the total number of infected people after each completed day */
    private dataTotalCases: Array<number> = [];

    /** Array with the number of newly infected for each completed day */
    private dataNewCases: Array<number> = [];

    /** Singleton to access the current infection numbers */
    private stats: Stats;

    /** Singleton to access the upgrade controller */
    private upgradeController: UpgradeController;

    /** Container to change the size of the chart */
    private chartContainer: HTMLDivElement;

    private formContainer: HTMLFormElement;

    /** Canvas element to render the chart */
    private canvas: HTMLCanvasElement;

    /** Dom element to add the chart to the scene */
    private canvasDomElement: Phaser.GameObjects.DOMElement;

    constructor() {
        super({
            key: 'ChartScene',
            active: false
        });
        TimeController.getInstance().subscribe(this);
    }

    preload(): void {
        this.load.image('tablet', 'assets/sprites/main-scene/tablet.png')
    }

    init(): void {
        /** The game starts on day 0 with 0 infected people */
        this.day = 0;
        this.infected = 0;
        this.labels = ['Day 0'];
        this.dataTotalCases.push(0);
        this.dataNewCases.push(0);

        this.stats = Stats.getInstance();
        this.upgradeController = UpgradeController.getInstance();

        this.initialMoney = this.upgradeController.getBudget();
        this.initialInfected = 0;

        /** By default show all available data points */
        this.timeframe = 0;
        
        /** If the game is restarted, the current chart will be destroyed */
        if (this.chart != null) {
            this.chart.destroy();
        }
    }

    create(): void {
        /** Initialize the chart and create the form to customize the chart */
        this.initializeChart();
        this.createForm();

        this.hideComponent();
    }

    /** 
     * Update function to get the current infection numbers
     * and update the chart accordingly 
    */
    updateChart(): void {
        this.day += 1;

        /** Update the labels */
        this.labels.push('Day ' + this.day);

        /** Get current infection numbers */
        const currentlyInfected = this.stats.getInfected();

        /** Update both datasets */
        this.dataTotalCases.push(currentlyInfected);
        this.dataNewCases.push(currentlyInfected - this.infected);

        /** Update current infection numbers */
        this.infected = currentlyInfected;

        /** Update the chart with the new data point depending on the timeframe */
        this.chart.data.labels = this.labels.slice(this.timeframe);
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data = (dataset.label == 'Total Cases') ? this.dataTotalCases.slice(this.timeframe) : this.dataNewCases.slice(this.timeframe);
        });
        
        /** Render the new chart in index.html */
        this.chart.update();
    }

        /** Create the form, which allows to customize the chart */
    createForm(): void {
        /** Create the form */
        this.formContainer = document.createElement('form');
        this.formContainer.setAttribute('id', 'chart-form');

        const textNodeAxis = document.createTextNode('Choose axis:');
        this.formContainer.appendChild(textNodeAxis);

        /** Create the dropdown menu and associated options to change between the linear and logarithmic scale */
        const selectChartAxis = document.createElement('select');
        selectChartAxis.setAttribute('id', 'chart-axis');
        this.formContainer.appendChild(selectChartAxis);

        const optionLinearAxis = document.createElement('option');
        optionLinearAxis.setAttribute('value', 'linear');
        optionLinearAxis.appendChild(document.createTextNode('linear'));

        const optionLogarithmicAxis = document.createElement('option');
        optionLogarithmicAxis.setAttribute('value', 'logarithmic');
        optionLogarithmicAxis.appendChild(document.createTextNode('logarithmic'));

        selectChartAxis.appendChild(optionLinearAxis);
        selectChartAxis.appendChild(optionLogarithmicAxis);

        const textNodeTimeframe = document.createTextNode('Select timeframe:');
        this.formContainer.appendChild(textNodeTimeframe);

        /** Create the dropdown menu and associated options to select how many days should be displayed on the chart */
        const selectTimeframe = document.createElement('select');
        selectTimeframe.setAttribute('id', 'timeframe');
        this.formContainer.appendChild(selectTimeframe);

        const option10Days = document.createElement('option');
        option10Days.setAttribute('value', '-10');
        option10Days.appendChild(document.createTextNode('10 Days'));

        const option20Days = document.createElement('option');
        option20Days.setAttribute('value', '-20');
        option20Days.appendChild(document.createTextNode('20 Days'));

        const option30Days = document.createElement('option');
        option30Days.setAttribute('value', '-30');
        option30Days.appendChild(document.createTextNode('30 Days'));

        const optionAll = document.createElement('option');
        optionAll.setAttribute('selected', 'selected');
        optionAll.setAttribute('value', '0');
        optionAll.appendChild(document.createTextNode('Show all'));

        selectTimeframe.appendChild(option10Days);
        selectTimeframe.appendChild(option20Days);
        selectTimeframe.appendChild(option30Days);
        selectTimeframe.appendChild(optionAll);
        
        /** Create the button to submit the form */
        const updateButton = document.createElement('input');
        updateButton.setAttribute('id', 'update-button');
        updateButton.setAttribute('type', 'submit');
        updateButton.setAttribute('value', 'Update Chart');
        this.formContainer.appendChild(updateButton);

        /** Change what happens when you submit the form */
        this.formContainer.onsubmit = function(event): void {
            /** Prevent the default behaviour of the button */
            event.preventDefault();

            /** Change the scale */
            this.chart.options.scales.yAxes[0].type = selectChartAxis.options[selectChartAxis.selectedIndex].value;

            /** Change the timeframe */
            if (this.timeframe != selectTimeframe.options[selectTimeframe.selectedIndex].value) {
                this.timeframe = selectTimeframe.options[selectTimeframe.selectedIndex].value;

                /** Update the chart based on the new timeframe */
                this.chart.data.labels = this.labels.slice(this.timeframe);
                this.chart.data.datasets.forEach((dataset) => {
                    dataset.data = (dataset.label == 'Total Cases') ? this.dataTotalCases.slice(this.timeframe) : this.dataNewCases.slice(this.timeframe);
                });
            }
            
            /** Update the chart */
            this.chart.update();
        }.bind(this);

        /** Create the button to reset the zoom */
        const resetZoomButton = document.createElement('input');
        resetZoomButton.setAttribute('id', 'reset-zoom-button');
        resetZoomButton.setAttribute('type', 'button');
        resetZoomButton.setAttribute('value', 'Reset Zoom');
        this.formContainer.appendChild(resetZoomButton);

        resetZoomButton.onclick = function(): void {
            this.chart.resetZoom();
        }.bind(this);

        /** Change the style of the form */
        const style = document.createElement('style');
        style.innerHTML = `
        #chart-axis, #timeframe {
            margin-left: 5px;
            margin-right: 30px;
        }
        
        #reset-zoom-button {
            margin-left: 50px;
        }`;
        document.head.appendChild(style);

        /** Add the form to the scene */
        const formDomElement = this.add.dom(this.canvasDomElement.x + 10, this.canvasDomElement.y + this.canvas.clientHeight - 2, this.formContainer);
        formDomElement.setOrigin(0, 0);

        /** Append the form to the container in index.html, otherwise the form will not be displayed */
        document.getElementById('form-container').appendChild(this.formContainer);
    }

    /** @see TimeSubscriber */
    public notify(): void {this.updateChart();}

    /** Function to initialize the chart at the start of the game */
    private initializeChart(): void {
        /** Create the chart container and set the attributes */
        this.chartContainer = document.createElement('div');
        this.chartContainer.setAttribute('id', 'chart-container');
        this.chartContainer.setAttribute('style', 'width: 38%');

        /** Create the canvas and set the attributes */
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', 'chart');
        this.canvas.setAttribute('aria-label', 'infection numbers');
        this.canvas.setAttribute('role', 'img');

        /** Append the canvas to the container */
        this.chartContainer.appendChild(this.canvas);

        /** Append the container to the parent container in index.html, otherwise the chart will not be displayed */
        document.getElementById('parent-chart-container').appendChild(this.chartContainer);

        /** Add the canvas to the scene */
        this.canvasDomElement = this.add.dom(95, 65, this.canvas);
        this.canvasDomElement.setOrigin(0, 0);

        /** Create new chart */
        this.chart = new Chart(this.canvas, {
            /** Line chart to show the total number of people infected */
            type: 'line',

            data: {
                labels: this.labels,
                datasets: [{
                    label: 'Total Cases',
                    backgroundColor: 'transparent',
                    borderColor: '#FF0000',
                    data: this.dataTotalCases,
                }, {
                    label: 'New Cases',
                    backgroundColor: '#FF8000',
                    borderColor: '#FF8000',
                    data: this.dataNewCases,
                    /** Bar chart to show the number of people infected every day */
                    type: 'bar',
                }]
            },

            options: {
                /** Display the title of the chart */
                title: {
                    display: true,
                    text: 'Infection Numbers'
                },

                scales: {
                    yAxes: [{
                        /** Default type of the y-axis is linear */
                        type: 'linear',
                        display: true,
                        ticks: {
                            /** Minimum value of the scale is 0 */
                            min: 0,
                            /** The logarithmic scale uses the scientific notation for the labels on the y-axis,
                             * this callback function converts them to the normal notation */
                            callback: function (label): number {
                                return Number(label.toString());
                            },
                            /** Show a maximum of 10 labels on the y-axis */
                            maxTicksLimit: 10
                        }
                    }]
                },

                /** Resize the canvas when the size of chart-container changes */
                responsive: true,

                /** Do not maintain the aspect ratio when resizing */
                maintainApsectRatio: false,

                /** Configure plugins */
                plugins: {
                    /** 
                     * Zoom and pan plugin for Chart.js
                     * source: https://github.com/chartjs/chartjs-plugin-zoom
                     */
                    zoom: {
                        /** Pan options */
                        pan: {
                            /** Enable panning */
                            enabled: true,
                            /** Only allow panning in x-direction */
                            mode: 'x',
                            /** Pan velocity */
                            speed: 1,
                            /** Minimal distance before applying pan */
                            threshold: 1
                        },

                        /** Zoom options */
                        zoom: {
                            /** Enable zoom */
                            enabled: true,
                            /** Disable drag-to-zoom */
                            drag: false,
                            /** Only allow zooming in x-direction */
                            mode: 'x',
                            /** Minimal level before applying zoom */
                            sensitivity: 0.5
                        }
                    }
                }
            }
        });
    }

    /** @see TutorialComponent */    
    public hideComponent(): void {
        this.chartContainer.style.visibility = "hidden"; //hide HTML-Elements 
        this.formContainer.style.visibility = "hidden";
    }

    /** @see TutorialComponent */
    public activateComponent(): void {
        this.chartContainer.style.visibility = "visible"; //make HTML-Elements visible
        this.formContainer.style.visibility = "visible";
    }
}