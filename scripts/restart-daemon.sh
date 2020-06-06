#!/bin/bash
sudo /etc/init.d/transmission-daemon stop
echo "> Daemon service stopped."
echo ""
echo "// Insert transmission settings file"
sudo cp lib/transmission.settings.json /etc/transmission-daemon/settings.json
echo "> Saved."
sudo /etc/init.d/transmission-daemon start
echo "> Daemon service restarted."
echo ""
