# Platonics GUI

This is the GUI for the Platonics to interact with the robot. It uses roslibjs to communicate with the robot and the ROS system.

## Installation

To install the GUI, you need to have npm installed. You can install it by running the following command:
The running also depends on tmuxp, which can be installed by running the following command:

```bash
sudo apt install npm
sudo apt install tmuxp
```

Then, you can install the GUI by running the following commands:

```bash
git clone ssh://github.com/platonics-delft/platonics_gui.git
cd platonics_gui
npm install
```

## Running the GUI

First, you have to determine your IP address, the host computer's one, and the
robot's one. Let's call them `your_ip`, `host_ip` and `robot_ip` respectively.
Additionally, you need the `host_user`.
You can find your IP address by running the following command:

```bash
hostname -I
```

Then you have to set the IP addresses as following: In `src/app.ts`, search for
the line `const app = new App('ws://your_ip:9090');` and replace `your_ip` with
your IP address. In `config/start_app.yaml`, search for the line `-export
ROS_MASTER_URI=http://host_ip:11311` and replace `host_ip` with your IP address.
In the same file, search for the line `-export ROS_IP=your_ip` and replace
`your_ip` with the your IP address. In the same file, search for the line `- ssh
host_user@host_ip` and replace `host_user` with the user of the host computer
and `host_ip` with the IP address of the host computer. In the same file, search
for
`- roslaunch franka_human_friendly_controllers cartesian_variable_impedance_controller.launch robot_ip:=robot_ip arm_id:='panda' gui:=False` and replace `robot_ip` with the IP address of the
  robot.

Then, you can run the GUI by running the following command:

The whole system is being launch with 
```bash
cd /path/to/platonics_gui/config
tmuxp load start_app.yaml
```

If you want to run the GUI only, you can run the following command:

```bash
npm run start
```




