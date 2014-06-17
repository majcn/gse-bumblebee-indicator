/*
 * This file is part of Bumblebee Indicator Gnome Shell Extension.
 *
 * Bumblebee Indicator Gnome Shell Extension is free software; you can
 * redistribute it and/or modify it under the terms of the GNU General
 * Public License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * Author: Alessio Gaeta <alga777@gmail.com>
 * Maintainer: Gregor Majcen <majcn.m@gmail.com>
 *
 */

const Gio = imports.gi.Gio;
const St = imports.gi.St;
const Main = imports.ui.main;

const Lang = imports.lang;

const ExtensionUtils = imports.misc.extensionUtils;
const Local = ExtensionUtils.getCurrentExtension();
const Convenience = Local.imports.convenience;

function ExtensionController(extensionMeta) {
    return {
        extension: new BumblebeeIndicator(extensionMeta),

        enable: function() {
            this.extension.enable();
        },

        disable: function() {
            this.extension.disable();
        }
    }
}

function BumblebeeIndicator(extensionMeta) {
    this._init(extensionMeta);
}

BumblebeeIndicator.prototype = {
    _init: function(extensionMeta) {
        let config = new Convenience.Config();

        let activeIcon = this._getIcon(extensionMeta.path + '/images/bumblebee-indicator-active.svg');
        let unactiveIcon  = this._getIcon(extensionMeta.path + '/images/bumblebee-indicator.svg');
        this._icons = [unactiveIcon, activeIcon];

        let lockFile = '/tmp/.X' + config.virtualDisplay + '-lock';
        this._lockMonitor = Gio.File.new_for_path(lockFile).monitor_file(Gio.FileMonitorFlags.NONE, null);

        this.button = new St.Bin({ style_class: 'panel-button' });
        this.button.set_child(this._icons[0]);
    },

    _getIcon: function(path) {
        let gicon = Gio.Icon.new_for_string(path);
        return new St.Icon({ gicon: gicon,
                             style_class: 'system-status-icon' });
    },

    _statusChanged: function(monitor, a_file, other_file, event_type) {
        log('majcn');
        if (event_type == Gio.FileMonitorEvent.CREATED) {
            this._setButtonIcon(true);
        } else if (event_type ==  Gio.FileMonitorEvent.DELETED) {
            this._setButtonIcon(false);
        }
    },

    _setButtonIcon: function(active) {
        let iconIndex = active ? 1 : 0;
        this.button.set_child(this._icons[iconIndex]);
    },

    enable: function() {
        this._lockMonitor.id = this._lockMonitor.connect('changed', Lang.bind(this, this._statusChanged));
        Main.panel._rightBox.insert_child_at_index(this.button, 0);
    },

    disable: function() {
        this._lockMonitor.disconnect(this._lockMonitor.id);
        Main.panel._rightBox.remove_child(this.button);
    }
}

function init(extensionMeta) {
    return new ExtensionController(extensionMeta);
}
