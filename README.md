# SeaTable Plugin Org Chart

**Org Chart** is a SeaTable Server plugin that displays the hierarchy between data records in a table, such as positions in a company or superordinate and subordinate tasks in a project.

This visualization helps users easily comprehend organizational structures and task dependencies, making it simpler to manage roles and responsibilities. By providing a clear overview of hierarchies, the plugin also facilitates better planning and coordination within teams.

![Screenshot of Org Chart](./org-chart.png)

## What is a SeaTable Plugin?

SeaTable, the world-leading no-code app-building platform, supports plugins. Plugins provide additional visualization or interaction possibilities within a SeaTable base. Examples of SeaTable Plugins include the Gallery, the Map Plugin, or the Kanban board. You can find a list of all publicly available plugins [here](https://cloud.seatable.io/apps/custom/plugin-archive).

## How to install

In general, a Plugin needs to be installed by the system admin on the SeaTable server and can then be activated in any base by the user. More information about the installation of plugins can be found in the [SeaTable Admin Manual](https://admin.seatable.io/configuration/plugins/?h=plugins).

## How to develop and contribute to this plugin

Please refer to the [SeaTable Plugin Template](https://github.com/seatable/seatable-plugin-template-base/tree/TB-staging) documentation on GitHub. This guide explains how to set up your local testing environment, create a `setting.local.js` file to connect to a SeaTable base, and more.

## Changelog

### Version 1.1.0

- Support for link-column changes with SeaTable v5.2

### Version 1.0.0

- Initial release with SeaTable v5.0.
- Displays collapsable org structure
- Hide/show other fields
- Display field names
