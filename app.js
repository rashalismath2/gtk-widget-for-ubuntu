
imports.gi.versions.Gtk = "3.0";
const {  Gtk ,GLib} = imports.gi;

Gtk.init(null);

let win = new Gtk.Window({ title: "GTK Widget Example" });
// win.set_border_width(10);
win.set_default_size(400, 300); // Set width and height
win.set_decorated(false);

let screen = win.get_screen();
let x = screen.get_width() - win.get_allocated_width();
let y = (screen.get_height() - win.get_allocated_height()) / 2;
win.move(x, y); // Move to the calculated position

win.draggable = true;


function formatOutPut(string) {
    let now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}` +"\n"+string;
}

let [success, stdout, stderr, exitStatus] = GLib.spawn_command_line_sync("sensors");
var initialReading="";
if (success) {
    initialReading=formatOutPut(stdout.toString().trim())
} else {
    label.set_label("Error running command");
}

let label = new Gtk.Label({ label: initialReading });
win.add(label);

// Function to update the label with the current time
function updateTime() {
    let [success, stdout, stderr, exitStatus] = GLib.spawn_command_line_sync("sensors");

    if (success) {
        label.set_label(formatOutPut(stdout.toString().trim()));
    } else {
        label.set_label("Error running command");
    }
    return true; // Return true to continue the timer
}

// Add a timer to call the updateTime function every second
let timerId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 30, updateTime);

win.connect("destroy", () => {
    GLib.source_remove(timerId); // Remove the timer when the window is destroyed
    Gtk.main_quit();
});

win.show_all();

Gtk.main();
