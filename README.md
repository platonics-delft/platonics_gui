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

The whole system is being launch with 
```bash
cd /path/to/platonics_gui/config
tmuxp load run_challenge.yaml
```

If you want to run the GUI only, you can run the following command:

```bash
npm run start
```




