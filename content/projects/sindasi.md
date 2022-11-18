---
title: "Sindasi | [Frontend, Backend]"
date: 2021-02-05
---

# Sindasi: Student Recommended SPK Using the AHP-TOPSIS Method

### Brief :
An application is needed that can assist the Department Bureaucracy in finding suitable students for certain cases such as competitions/research etc. The application must be dynamic, meaning that it can be adjusted, so that it can be used in multiple cases as long as it uses student data (Courses scores, organization, parents' salaries) in the form of information filled in by the student as well as course grade data from an academic information system.

case examples: recommendations for prospective scholarship recipients, recommendations for contest delegates, recommendations for lecturer research assistance, etc.

### Solution :
Sindasi is a Student Information and Recommendation System. This system provides complete student information, both academic and non-academic. In addition, this system applies the Decision Support System method in the process of determining student recommendations dynamically by using a combination of **Analytical Hierarchy Process and Technique for Order Preference by Similarity to Ideal Solution (AHP-TOPSIS)** methods. This means recommendations can be made dynamic with adjustable weight preferences.
Recommendations made can be configured through assessment and pairwise comparison of criteria and then stored as recommendation preferences. Student recommendations can then be generated based on the saved preferences. The criteria are obtained from a number of student data in the form of (course grades, extracurricular activities, or achievements). The weight of each criterion can be different for each recommendation, so that it can be used dynamically to assist heads of departments or study program heads in finding student recommendations for specific specific needs.

Feature details can be seen in the following table:
No | Features | Lecturer | Kajur | Head of study program | Student | admin |
-------|-------|-------|-------|-------|-------|-------|
1 | Login | Yes | Yes | Yes | Yes | Yes |
2 | Dashboard | Yes | Yes | Yes | Yes | Yes |
3 | Manage student data | -| -| -| Yes | -|
4 | Display student list | Only student guidance | all students | Study program students only | -| all students |
5 | Display student profiles and academics | Only student guidance | all students | Study program students only | Only his profile | all students |
6 | Monitor courses | -| All Courses | Only Courses Prodi | -| -|
7 | Master criteria | Only | Only | Only | -| View, Update, Delete, and Add criteria |
8 | Preference master | View, add preferences, delete only his preferences | View, add preferences, delete all preferences | View, add preferences, delete only his preferences | -| View, add preferences, delete all preferences |
9 | Auto recommendation | -| Yes | Yes | -| -|
10 | Manage user data | -| Yes | -| -| Yes |
11 | Import data | -| Yes | -| -| Yes

#### Screenshot :
![/projects/sindasi1.png](/projects/sindasi1.png)
![/projects/sindasi2.png](/projects/sindasi2.png)
![/projects/sindasi3.png](/projects/sindasi3.png)