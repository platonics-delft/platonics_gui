import { Ros, Topic, ActionClient, Goal, Service, ServiceRequest} from "roslib";
import errorSnippet from "./audio/error.mp3";
import succesSnippet from "./audio/success.mp3";
import pausedSnippet from "./audio/paused.mp3";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class App {
    private topicDisplayElement: HTMLElement;
    private cameraElement: HTMLElement;
    private cameraCorrectionElement: HTMLElement;
    private ros: Ros;
    private topic: Topic;
    private camera_topic: Topic;
    private camera_correction_topic_compressed: Topic;
    private trajectoriesDropdownElement: HTMLSelectElement;

    constructor(ipAddress: string) {
        this.ipAddressElement = document.getElementById("ipAddressElement") as HTMLInputElement;
        this.loadAudioSnippets();
        this.debugTopicDisplayElement = document.getElementById("debug_topic_display");
        if (!this.debugTopicDisplayElement) {
            throw new Error(`Element with ID debug_topic_display not found.`);
        }

        this.cameraElement = document.getElementById("ros_img");
        if (!this.cameraElement) {
            throw new Error(`Element with ID ros_img not found.`);
        }

        this.templatesDropdownElement = document.getElementById("template_dropdown") as HTMLSelectElement;
        this.cameraCorrectionElement = document.getElementById("img_corrections");
        if (!this.cameraCorrectionElement) {
            throw new Error(`Element with ID img_corrections not found.`);
        }
        this.trashBin = document.getElementById("trash-bin");
        this.localize_button = document.getElementById("localize_button");
        this.automatic_template_button = document.getElementById("automatic_template");
        this.templateRecordElement = document.getElementById("template_name_record") as HTMLInputElement;
        this.speedFactorElement = document.getElementById("speed_factor");

        this.statusRecordingElement = document.getElementById("statusRecording");
        this.statusExecutingElement = document.getElementById("statusExecuting");
        this.statusPausedElement = document.getElementById("statusPaused");
        this.statusSpiralingElement = document.getElementById("statusSpiraling");
        this.statusCameraFeedbackElement = document.getElementById("statusCameraFeedback");
        this.statusStiffnessElement = document.getElementById("statusStiffness");
        this.statusGripperElement = document.getElementById("statusGripper");

        this.trajectoriesDropdownElement = document.getElementById("trajectories_dropdown") as HTMLSelectElement;
        this.skillsDropdownElement = document.getElementById("skills_dropdown") as HTMLSelectElement;
        if (!this.trajectoriesDropdownElement) {
            throw new Error(`Element with ID trajectories_dropdown not found.`);
        }
        this.availableTrajectories = [];
        this.availableSkills = [];
        this.availableTemplates = [];

        this.record_text_field = document.getElementById("recording_name") as HTMLInputElement;
        this.startApp(ipAddress);
      }

      private startApp(ipAddress: string) {
        const rosUrl = "ws://" + ipAddress + ":9090";
        console.log("Connecting to ROS at " + rosUrl);
        this.ros = new Ros({ url: rosUrl });
        this.debug_topic = new Topic({
            ros: this.ros,
            name: "/debug",
            messageType: "std_msgs/String",
        });
        this.recording_topic = new Topic({
          ros: this.ros,
          name: "/recording",
          messageType: "std_msgs/Bool",
        });
        this.camera_topic = new Topic({
            ros: this.ros,
            name: '/camera/color/image_raw/compressed',
            messageType: 'sensor_msgs/CompressedImage',
        });

        this.camera_correction_topic_compressed = new Topic({
            ros: this.ros,
            name: '/sift_compressed/compressed',
            messageType: 'sensor_msgs/CompressedImage',
        });


        this.order_menu = document.getElementById("menuContainer");


        this.setupRosTopic();
        this.setupCameraRosTopic();
        this.setupCameraCorrectionsRosTopic();
        // home client
        this.home_client = new ActionClient({
          ros: this.ros,
          serverName: '/lfdHome',
          actionName: 'skills_manager/LfdHomeAction',
        });
        this.home_goal = new Goal({
          actionClient: this.home_client,
          goalMessage: {
            height: 0.25,
            side: 0.0,
            front: 0.46,
          },
        });
        this.home_goal.on('result', () => {
          this.homing = false;
          this.enable_all_main_buttons();
        }
        this.home_byod_goal = new Goal({
          actionClient: this.home_client,
          goalMessage: {
            height: 0.15
            side: 0.0,
            front: 0.45,
          },
        });
        this.home_byod_goal.on('result', () => {
          this.homing = false;
          this.enable_all_main_buttons();
        }

        // record client
        this.record_client = new ActionClient({
          ros: this.ros,
          serverName: '/lfdRecord',
          actionName: 'skills_manager/LfdRecordAction',
        });

        this.record_goal = new Goal({
          actionClient: this.record_client,
          goalMessage: {
            skill_name: "default",
          },
        });
        this.record_goal.on('result', () => {
          this.recording = false;
          this.refreshTrajectories();
          this.enable_all_main_buttons();
          this.statusRecordingElement.classList.remove("status-active");
        }
        this.record_goal.on('feedback', (feedback) => {
          if (feedback.paused === true) {
            this.playSnippet('paused');
            this.statusPausedElement.classList.add("status-active");
          }
          if (feedback.spiraling === true) {
            this.statusSpiralingElement.classList.add("status-active");
          }
          if (feedback.camera_feedback === true) {
            this.statusCameraFeedbackElement.classList.add("status-active");
          }
          if (feedback.stiffness === true) {
            this.statusStiffnessElement.classList.add("status-active");
          }
          if (feedback.gripper === true) {
            this.statusGripperElement.classList.add("status-active");
          }
          if (feedback.paused === false) {
            this.statusPausedElement.classList.remove("status-active");
          }
          if (feedback.spiraling === false) {
            this.statusSpiralingElement.classList.remove("status-active");
          }
          if (feedback.camera_feedback === false) {
            this.statusCameraFeedbackElement.classList.remove("status-active");
          }
          if (feedback.stiffness === false) {
            this.statusStiffnessElement.classList.remove("status-active");
          }
          if (feedback.gripper === false) {
            this.statusGripperElement.classList.remove("status-active");
          }
        }

        // execute client
        this.execute_client = new ActionClient({
          ros: this.ros,
          serverName: '/lfdExecuteSkillSequence',
          actionName: 'skills_manager/LfdExecuteSkillSequenceAction',
        });

        this.execute_goal = new Goal({
          actionClient: this.execute_client,
          goalMessage: {
            skill_names: [],
            localize_box: false,
            speed_factor: 1,
            template_name: 
            {
              data: "default",
            }
          },
        });
        this.execute_goal.on('result', () => {
          this.executing = false;
          this.enable_all_main_buttons();
          this.statusExecutingElement.classList.remove("status-active");
        }
        this.execute_goal.on('feedback', (feedback) => {
          if (feedback.spiraling === true) {
            this.statusSpiralingElement.classList.add("status-active");
          }
          if (feedback.camera_feedback === true) {
            this.statusCameraFeedbackElement.classList.add("status-active");
          }
          if (feedback.stiffness === true) {
            this.statusStiffnessElement.classList.add("status-active");
          }
          if (feedback.gripper === true) {
            this.statusGripperElement.classList.add("status-active");
          }
          if (feedback.spiraling === false) {
            this.statusSpiralingElement.classList.remove("status-active");
          }
          if (feedback.camera_feedback === false) {
            this.statusCameraFeedbackElement.classList.remove("status-active");
          }
          if (feedback.stiffness === false) {
            this.statusStiffnessElement.classList.remove("status-active");
          }
          if (feedback.gripper === false) {
            this.statusGripperElement.classList.remove("status-active");
          }
        }
        // execute client
        this.execute_skill_client = new ActionClient({
          ros: this.ros,
          serverName: '/lfdExecuteSkill',
          actionName: 'skills_manager/LfdExecuteSkillAction',
        });

        this.execute_skill_goal = new Goal({
          actionClient: this.execute_skill_client,
          goalMessage: {
            skill_name: [],
            localize_box: false,
            template_name: "default",
          },
        });
        this.execute_skill_goal.on('result', () => {
          this.executing = false;
          this.enable_all_main_buttons();
          this.statusExecutingElement.classList.remove("status-active");
        }
        this.executing = false;
        this.recording = false;
        this.homing = false;

        this.abort_gripper_client = new ActionClient({
          ros: this.ros,
          serverName: '/abort_gripper',
          actionName: 'skills_manager/AbortGripperAction',
        });

        this.abort_gripper_goal = new Goal({
          actionClient: this.abort_gripper_client,
          goalMessage: {
            open : false,
          },
        });

        this.save_sift_template = new Service({
          ros: this.ros,
          name: '/saving_sift_template',
          serviceType: 'platonics_vision/SavingTemplate',
        });


        this.list_trajectories = new Service({
          ros: this.ros,
          name: '/list_trajectories',
          serviceType: 'skills_manager/ListTrajectories',
        });
        this.list_templates = new Service({
          ros: this.ros,
          name: '/list_templates',
          serviceType: 'skills_manager/ListTemplates',
        });
        this.list_skills = new Service({
          ros: this.ros,
          name: '/list_skills',
          serviceType: 'skills_manage/ListSkills',
        });

        this.reset_transformation = new Service({
          ros: this.ros,
          name: '/reset_transformation',
          serviceType: 'std_srvs/Trigger',
        });
        this.refreshTemplates();
    }

    public restartApp() {
      const ip_address = this.ipAddressElement.value;
      this.ros.close();
      this.startApp(ip_address);
    }

    public cancel() {
      this.playSnippet('error');
      this.execute_client.cancel();
      this.record_client.cancel();
      this.home_client.cancel();
      this.enable_all_main_buttons();
    }

    public home_gripper() {
      this.abort_gripper_client.cancel();
      this.log("Homing gripper");
      this.abort_gripper_goal.goalMessage.goal.open = true;
      this.abort_gripper_goal.send();
    }

    public abort_gripper() {
      this.abort_gripper_client.cancel();
      this.log("Aborting gripper");
      this.abort_gripper_goal.goalMessage.goal.open = false;
      this.abort_gripper_goal.send();
    }


    public selectTrajectory() {
      var skill_name = this.trajectoriesDropdownElement.value;
      const newItem = document.createElement("div");
      newItem.classList.add("menu-item");
      newItem.setAttribute("draggable", "true");
      newItem.textContent = skill_name;
      this.order_menu.appendChild(newItem);
      this.addDragAndDropHandlers(newItem);
    }

    public selectSkill() {
      var skill_name = this.skillsDropdownElement.value;
      const newItem = document.createElement("div");
      newItem.classList.add("menu-item");
      newItem.setAttribute("draggable", "true");
      newItem.textContent = skill_name;
      this.order_menu.appendChild(newItem);
      this.addDragAndDropHandlers(newItem);
    }

    public clearMenu() {
      this.order_menu.innerHTML = "";
    }

    public selectTemplate() {
      this.refreshTrajectories();
      this.refreshSkills();
    }

    public addDragAndDropHandlers(item) {
      item.addEventListener("dragstart", () => {
        this.draggedItem = item;
        setTimeout(() => {
          item.classList.add("dragging");
        }, 0);
      });

      item.addEventListener("dragend", () => {
        setTimeout(() => {
          item.classList.remove("dragging");
          this.draggedItem = null;
        }, 0);
      });
      
      item.addEventListener("dragover", (e) => {
        e.preventDefault();
        item.classList.add("over");
      });

      item.addEventListener("dragleave", () => {
        item.classList.remove("over");
      });

      item.addEventListener("drop", () => {
        item.classList.remove("over");
        if (this.draggedItem !== item) {
          let menu = item.parentNode;
          let siblings = [...menu.children];
          let targetIndex = siblings.indexOf(item);
          let draggedIndex = siblings.indexOf(this.draggedItem);

          if (targetIndex < draggedIndex) {
            menu.insertBefore(this.draggedItem, item);
          } else {
            menu.insertBefore(this.draggedItem, item.nextSibling);
          }
        }
      });
      this.trashBin.addEventListener("dragover", (e) => {
        e.preventDefault();
        this.trashBin.classList.add("over-trash");
      });

      this.trashBin.addEventListener("dragleave", () => {
        this.trashBin.classList.remove("over-trash");
      });

      this.trashBin.addEventListener("drop", () => {
        this.trashBin.classList.remove("over-trash");

        // Remove the dragged item from the DOM when dropped into the trash bin
        if (this.draggedItem) {
          this.draggedItem.remove();
          this.draggedItem = null;
        }
      });

    }

    public saveSiftTemplate() {
      const request = {template_name: {data: this.templateRecordElement.value}};
      this.save_sift_template.callService(request, (result) => {
        console.log("Saving template: " + result.success);
      });
    }

    private playSnippet(snippetKey: string) {
      const audio = this.audioSnippets[snippetKey];
      if (audio) {
          audio.currentTime = 0; // Reset playback to the beginning
          audio.play();
      } else {
          console.error(`Audio snippet ${snippetKey} not found`);
      }
    }

    private loadAudioSnippets() {
      this.audioSnippets = {
          success: new Audio(succesSnippet),
          error: new Audio(errorSnippet),
          paused: new Audio(pausedSnippet),
      };
    }


    public refreshTrajectories() {
      const request = new ServiceRequest({});
      request.template_name = this.templatesDropdownElement.value
      this.list_trajectories.callService(request, (result) => {
        this.availableTrajectories = result.trajectories;
        this.availableTrajectories.unshift("---select---");
        this.updateTrajectoriesDropdown();
      });
    }

    public refreshSkills() {
      const request = new ServiceRequest({});
      request.template_name = this.templatesDropdownElement.value
      this.list_skills.callService(request, (result) => {
        this.availableSkills = result.skills;
        this.availableSkills.unshift("---select---");
        this.updateSkillsDropdown();
      });
    }

    public refreshTemplates() {
      this.list_templates.callService(new ServiceRequest({}), (result) => {
        this.availableTemplates = result.templates;
        this.availableTemplates.unshift("---select---");
        this.updateTemplatesDropdown();
      });
      //this.emptyMenu();
    }

    public resetTransformation() {
      this.reset_transformation.callService(new ServiceRequest({}), (result) => {
        console.log("Reset transformation");
      });
    }

    private updateTemplatesDropdown() {
      const sortedTemplates = [...this.availableTemplates].sort();
      this.templatesDropdownElement.innerHTML = '';
      sortedTemplates.forEach((template) => {
          const option = document.createElement('option');
          option.value = template;
          option.textContent = template;
          this.templatesDropdownElement.appendChild(option);
      });
    }

    private updateTrajectoriesDropdown() {
      const sortedTrajectories = [...this.availableTrajectories].sort();
      this.trajectoriesDropdownElement.innerHTML = '';
      sortedTrajectories.forEach((trajectory) => {
          const option = document.createElement('option');
          option.value = trajectory;
          option.textContent = trajectory;
          this.trajectoriesDropdownElement.appendChild(option);
      });
    }

    private updateSkillsDropdown() {
      const sortedSkills = [...this.availableSkills].sort();
      this.skillsDropdownElement.innerHTML = '';
      sortedSkills.forEach((skill) => {
          const option = document.createElement('option');
          option.value = skill;
          option.textContent = skill;
          this.skillsDropdownElement.appendChild(option);
      });
    }

    public disable_all_main_buttons() {
      var buttons = document.getElementsByClassName("main-button");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].setAttribute("disabled", "true");
      }
    }

    public enable_all_main_buttons() {
      var buttons = document.getElementsByClassName("main-button");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].removeAttribute("disabled");
      }
    }




    public sendHome() {
      this.disable_all_main_buttons();
      this.homing = true;
      this.home_goal.send();
    }

    public sendHomeBYOD() {
      this.disable_all_main_buttons();
      this.homing = true;
      this.home_byod_goal.send();
    }

    public execute_skill() {
      var items = document.getElementsByClassName("menu-item");
      console.log("executing skill")
      this.execute_skill_goal.goalMessage.goal.skill_name = items[0].textContent;
      console.log(items[0].textContent);
      if this.automatic_template_button.checked {
        this.execute_skill_goal.goalMessage.goal.template_name = "";
      } else {
        this.execute_skill_goal.goalMessage.goal.template_name = this.templatesDropdownElement.value;
      }
      this.execute_skill_goal.goalMessage.goal.localize_box = this.localize_button.checked;
      //this.localize_button.checked;
      this.disable_all_main_buttons();
      this.execute_skill_goal.send();
    }



    public execute() {
      this.statusExecutingElement.classList.add("status-active");
      var items = document.getElementsByClassName("menu-item");
      var skill_names: string[] = [];
      for (var i = 0; i < items.length; i++) {
        skill_names.push(items[i].textContent || ""); // Ensure textContent is not null
      }
      this.execute_goal.goalMessage.goal.template_name = this.templatesDropdownElement.value;
      this.execute_goal.goalMessage.goal.skill_names = skill_names;
      // convert string to float
      this.execute_goal.goalMessage.goal.speed_factor = parseFloat(this.speedFactorElement.value);
      this.execute_goal.goalMessage.goal.localize_box = this.localize_button.checked;
      this.disable_all_main_buttons();
      this.execute_goal.send();
    }



    public record() {
      this.disable_all_main_buttons();
      this.statusRecordingElement.classList.add("status-active");
      this.record_goal.goalMessage.goal.skill_name = this.record_text_field.value;
      this.record_goal.goalMessage.goal.template_name = this.templatesDropdownElement.value;
      this.record_goal.send();
    }

    private setupCameraRosTopic() {
        this.camera_topic.subscribe((message: Message) => {
            this.cameraElement.src = 'data:image/jpeg;base64,' + message.data;
        });
    }

    private setupCameraCorrectionsRosTopic() {
      this.camera_correction_topic_compressed.subscribe((message: Message) => {
          console.log("Received camera correction");
          //console.log(message.data);
          this.cameraCorrectionElement.src = 'data:image/jpeg;base64,' + message.data;
        });
    }



   private setupRosTopic() {
    this.debug_topic.subscribe((message) => {
        
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

    public startDataRecord() {
      this.recording_topic.publish({
        data: true,
      });
    }

    public stopDataRecord() {
      this.recording_topic.publish({
        data: false,
      });
    }


    public log(message: string) {
        this.debug_topic.publish({
            data: message,
        });
    }
}

// Instantiate the App class when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App("172.16.0.3");
    // Expose the app instance to the global scope for the button's onclick handler
    (window as any).app = app;
});


