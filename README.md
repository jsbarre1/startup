# Your startup name here

[My Notes](notes.md)

Welcome to Budge-It, a user-friendly application meant to help you track and reduce your spending. Budge-it makes it fun by letting you compete against your peers based on how close you followed your Budge-It, and how well you did tracking your spending.

## 🚀 Specification Deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] Proper use of Markdown
- [x] A concise and compelling elevator pitch
- [x] Description of key features
- [x] Description of how you will use each technology
- [x] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

### Elevator pitch

Have you or a loved one ever spent too much money? Bought something you didn't need? Well you are in luck! This user-friendly application is all you need to get excited about budgeting and keep yourself accountable to your budget. Welcome to Budge-It!

### Design

![Design image](budge-it-homepage.png)
![Design image](budge-it-leaderboard.png)

Here is a sequence diagram that shows how the leaderboard will be updated

```mermaid
sequenceDiagram
    actor Friend_1
    actor Friend_2
    actor Friend_3
    actor Server
    Friend_1->>Server: Scored 1000 Points
    Server->>Friend_2: Friend_1 Scored 1000 Points
    Server->>Friend_3: Friend_1 Scored 1000 Points
    Friend_2->>Server: Scored 1500 Points
    Server->>Friend_3: Friend_2 Scored 1500 Points
    Server->>Friend_1: Friend_2 Scored 1500 Points
```

### Key features

- Secure login over HTTPS
- Edit your budget once every month
- Track your transactions and income
- Display budget/transaction data 
- Keeps track of money saved
- Provides a daily/weekly recommended spending
- Score points based on how well you did versus your budget
- Global leaderboard
- Real-time leaderboard updates

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Used correct HTML structure for application. Three HTML pages. One for login, one for personal budget, one for the leaderboard
- **CSS** - Application styling that responds to different screen sizes, used good whitespace, color choice, and contrast.
- **React** - Provides login, budget displays, leaderboard displays, adding transactions, and routing between pages
- **Service** - Backend service with endpoints for: 
    - login 
    - retrieving scores 
    - submiting score updates 
    - submitting transaction data 
    - retrieving transaction data 
    - logout
- **DB/Login** - Stores users, tranactions, and scores int the database. Register and login users. Credentials securely stored in database. Can't add transactions unless authenticated. Can view leaderboard if not logged in.
- **WebSocket** - As each user gains points through tracking their spending and following their budget, the gained points are broadcast to all other users for the leaderboard

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Server deployed and accessible with custom domain name** - [My server link](https://yourdomainnamehere.click).

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **HTML pages** - three HTML pages representing login, budget, and leaderboard.
- [x] **Proper HTML element usage** - used all the required elements described in the spec. 
- [x] **Links** - links to each html page in each of the html pages.
- [x] **Text** - text describing recent transactions and leaderboard entries.
- [x] **3rd party API placeholder** - placeholder for when someone scores points a random sound from a random sound api will go off.
- [x] **Images** - placeholder images for the pie chart and the bar graph.
- [x] **Login placeholder** - Login placeholder in index.html
- [x] **DB data placeholder** - Recent transactions represent database data.
- [x] **WebSocket placeholder** - Leaderboard entries and recent scorers represent WebSocket data.

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Header, footer, and main content body** - My website has all of these on every page
- [x] **Navigation elements** - the navbar is on every page letting you navigate easily to the three pages
- [x] **Responsive to window resizing** - Each page will make components of the page bigger or smaller depending on the size of the window
- [x] **Application elements** - I have an add transaction element, a recent transaction element, notification elements, and a leaderboard element
- [x] **Application text content** - plenty of text in my application
- [x] **Application images** - there are two images on my application representing potential graphs for the future

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Bundled using Vite** - added vite using npm
- [x] **Components** - Each page is a component in the router now
- [x] **Router** - Implimented react router

## 🚀 React part 2: Reactivity

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **All functionality implemented or mocked out** - I did not complete this part of the deliverable.
- [ ] **Hooks** - I did not complete this part of the deliverable.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Node.js/Express HTTP service** - I did not complete this part of the deliverable.
- [ ] **Static middleware for frontend** - I did not complete this part of the deliverable.
- [ ] **Calls to third party endpoints** - I did not complete this part of the deliverable.
- [ ] **Backend service endpoints** - I did not complete this part of the deliverable.
- [ ] **Frontend calls service endpoints** - I did not complete this part of the deliverable.

## 🚀 DB/Login deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **User registration** - I did not complete this part of the deliverable.
- [ ] **User login and logout** - I did not complete this part of the deliverable.
- [ ] **Stores data in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Stores credentials in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Restricts functionality based on authentication** - I did not complete this part of the deliverable.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [ ] **Application is fully functional** - I did not complete this part of the deliverable.
