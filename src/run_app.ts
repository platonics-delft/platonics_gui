import { Ros, Topic } from "roslib";

class App {
    private topicDisplayElement: HTMLElement;
    private cameraElement: HTMLElement;
    private ros: Ros;
    private topic: Topic;
    private camera_topic: Topic;

    constructor(rosUrl: string) {
        this.debugTopicDisplayElement = document.getElementById("debug_topic_display");
        if (!this.debugTopicDisplayElement) {
            throw new Error(`Element with ID debug_topic_display not found.`);
        }

        this.cameraElement = document.getElementById("ros_img");
        if (!this.cameraElement) {
            throw new Error(`Element with ID ros_img not found.`);
        }

        this.ros = new Ros({ url: rosUrl });
        this.debug_topic = new Topic({
            ros: this.ros,
            name: "/debug_topic",
            messageType: "std_msgs/String",
        });
        this.camera_topic = new Topic({
            ros: this.ros,
            name: '/camera/color/image_raw/compressed',
            messageType: 'sensor_msgs/CompressedImage',
        });

        this.setupRosTopic();
        this.setupCameraRosTopic();
    }

    private setupCameraRosTopic() {
        this.camera_topic.subscribe((message: Message) => {
            this.cameraElement.src = 'data:image/jpeg;base64,' + message.data;
        });
    }

    /*
    private setupRosTopic() {
        this.debug_topic.subscribe((message) => {
            console.log("Received debug message on /debug_topic: " + message.data);
            this.debugTopicDisplayElement.textContent = message.data;
        });
    }
    */

    private setupRosTopic() {
    this.debug_topic.subscribe((message) => {
        console.log("Received debug message on /debug_topic: " + message.data);
        
        // Create a new message element
        const newMessage = document.createElement('div');
        newMessage.classList.add('debug-message');
        newMessage.textContent = message.data;

        // Prepend the new message to the debug window (at the top)
        this.debugTopicDisplayElement.prepend(newMessage);

        // Get all message elements
        const allMessages = this.debugTopicDisplayElement.querySelectorAll('.debug-message');

        // If more than 3 messages, fade out the oldest one
        if (allMessages.length > 3) {
            const oldestMessage = allMessages[allMessages.length - 1];
            oldestMessage.style.opacity = '0';  // Fade out
            setTimeout(() => oldestMessage.remove(), 500);  // Remove after fading out
        }
    });
}

    public publishMessage() {
        this.topic.publish({
            data: "Hello, world!",
        });
    }
}

// Instantiate the App class when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App('ws://localhost:9090');
    // Expose the app instance to the global scope for the button's onclick handler
    (window as any).app = app;
});

