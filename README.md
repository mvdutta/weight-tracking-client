# WeightTracker 
## ***An app to prevent unintentional weight loss in health care facilities***  <br><br>

# Application Overview  

>In a health care setting, unintentional weight loss is associated with adverse clinical outcomes and decline, especially in the elderly. Therefore, it is an important quality indicator for long term care and some skilled nursing/rehab facilities. Although the facility’s registered dietitian (RD) is commonly responsible for this quality indicator, interventions to prevent or treat weight loss are often multifaceted and require an interdisciplinary approach. 

>WeightTracker is a full-stack application designed to be used in conjuntion with a facility's EMR to allow the RD to obtain patient weights timely and systematically. It is also designed to identify patients at risk, display weight trends over time, and allow fast and efficient communication between disciplines.

>To demonstrate this application, a fictitious rehab and long term care facility called Gaffney Scranton Rehab and Healing (GSHR) was created. Users of WeightTracker include trained Certified Nursing Assistants (CNAs), RDs, Registered Nurses(RNs) and Licensed Practical Nurses (LPNs), Nurse Practitioners(NPs), and MDs. 

# Features
There are three primary types of users that can register and log in to their account: (CNA, RD, and RN/NP/MD).<br>
Responsive design allows for use on most screen sizes.<br>

Each user has different responsibilities:  
1. From their dashboard, CNAs can:
    - check and send messages to multiple users
    - view the current census list
    - create a new weight sheet for the week and enter in data for each patient
    - view previous weight sheets
    - save and update entered data at any time before the weight sheet is finalized by the RD
2. From their dashboard, RDs can:
    - check and send messages to multiple users
    - view the current census list
    - view, edit, save and finalize a weight sheet
    - view previous weight sheets
    - submitted weight sheet highlights missing or concerning data for RD to investigate
    - search for individual patients by name and view a table and graph of weight trends over a 6 month period to monitor significant weight changes
3. From their dashboard, RNs/NPs/MDs can:
    - check and send messages to multiple users
    - view current census list
    - view finalized weekly weight sheets 

# User Experience
## Register a new user and login

![](src/assets/gifs/register.gif)



# Technologies

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
 ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
 ![DjangoREST](https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=ff1709&labelColor=gray)







## Installation

* Fork and clone the repository
* Install necesary packages.
```bash
npm install
```
* Once all necessary packages are installed, start the game in development mode
```bash
npm start
```


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.


## License
[MIT](https://choosealicense.com/licenses/mit/)

