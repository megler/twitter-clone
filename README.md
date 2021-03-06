# Network

A Twitter Clone utilizing Django and Javascript.

## Features

1. If the visitor is not logged in, they will see a listing of all tweets.
2. A logged in user has the ability to tweet, like, follow.
3. A logged in user can edit their own tweets, but no others.
4. Logged in users viewing their personal profile page will be presented with a
sidebar of other users they may follow. The list is randomized so they will have 
the opportunity to see more users with each refresh.
5. The tweet list is limited to a max of 10 per page. A Pagination feature will 
present multiple pages if necessary.
6. Gravatars in comments are user specific. If user has a registered Gravatar it 
will be used, otherwise a generic will show up.
7. If a visitor is not logged in, they will see a user's username, but will not
be able to click it. Once they register/login they will be able to click a username 
(eg. @megler) and be taken to their profile.

## New User Registration
If a new user would like to have a background image, it can be done at time of 
registration. This is optional, but if you'd like to have an image, feel free to
copy the URL of one of the images listed below in Image Credits. Otherwise, use
an image url whose image is landscape oriented and prefrably has a long side of 
at least 2k pixels.

## Util.py
Any function in views.py that are not views are found in util.py in order to keep
views as lean as possible.


## Code Credits
Most code requiring credit is notated inline, but a few are not.

[Tweet-Box (HTML and CSS)](https://www.codingnepalweb.com/tweet-box-character-limit-highlighting-javascript/) - heavily modified
[Twitter HTML and CSS Template](https://github.com/jvadillo/twitter-bootstrap)


## Image Credits

- [Man on Skyscraper](https://www.pexels.com/photo/alone-buildings-city-cityscape-220444/)
- [Soldiers in Helicopter](https://www.pexels.com/photo/a-us-army-helicopter-hovering-above-a-group-of-soldiers-8079181/)
- [Sunflowers](https://images.pexels.com/photos/54267/sunflower-blossom-bloom-flowers-54267.jpeg?cs=srgb&dl=pexels-pixabay-54267.jpg&fm=jpg)
- [Cats](https://images.pexels.com/photos/4492163/pexels-photo-4492163.jpeg?cs=srgb&dl=pexels-aleksandr-nadyojin-4492163.jpg&fm=jpg)
- [Chihuahua](https://images.pexels.com/photos/4378919/pexels-photo-4378919.jpeg?cs=srgb&dl=pexels-ellie-burgin-4378919.jpg&fm=jpg)
- [Birds](https://images.pexels.com/photos/1435849/pexels-photo-1435849.jpeg?cs=srgb&dl=pexels-engin-akyurt-1435849.jpg&fm=jpg)
- [Lake](https://www.pexels.com/photo/lake-and-mountain-417074/)

## License

[MIT](https://choosealicense.com/licenses/mit/)