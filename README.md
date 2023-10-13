# SeaTable Org Chart Plugin Development 🚀

The SeaTable Org Chart plugin allows displays a graphic representation of the structure of your table and the relationship each rows.

## Basic process of plugin development

### 1. clone project

* clone current project to local
  
### 2. Modify plugin development configuration file

You should put your local settings in `setting.local.js` by copying from the sample file `setting.local.dist.js`

The configuration file is used for local development to get dtable data:

```
let config = {
  APIToken: process.env.REACT_APP_API_TOKEN, // replace with dtable api or create environment variable
  server: 'https://stage.seatable.io', // replace with server URL of the dtable to which the plugin needs to be added
  workspaceID: process.env.REACT_APP_WORKSPACE_ID, // replace with the id value of the workspace where the dtable of the plugin needs to be added or create environment variable
  dtableName: process.env.REACT_APP_DTABLE_NAME, // replace with name of dtable or create environment variable
  lang: 'zh-cn' // default language type, en or zh-cn
};
```

## Table structure example

- Here is an example of a dtable, it has multiple columns that includes a Linked Column
![Table](/src/assets/images/table.png)

- To create a Linked Column, select **Link to other records** as a column type
![Linked Column](/src/assets/images/linked_records.png)

- Click on more settings and enable **Limit linking to max one row** then click submit
![Linked Column settings](/src/assets/images/linked_records_settings.png)

- Org Chart view
![Org Chart](/src/assets/images/org_chart.png)

## Set Up

In the project directory, you can run:

#### Installation

`npm install`

#### Run App

`npm run start`

#### Build App

`npm run build`

## Things Left To Do

- Add view functionality

