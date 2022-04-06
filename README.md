# Pomodoro

A pomodoro application using tkinter. Day 28 Python Bootcamp


## Usage
The original technique has six steps:

## Profile Boolean
Because I chose to render multiple views without duplicating the index.html template
I found myself having to differentiate views in order to render all logic. This
led to the creation of a boolean called 'profile' which is found in the Index, All_Views,
and "User_Profile" views.

It allows all links to properly render and display, but it's messy. I know it's
messy. Due to the lost week, I didn't have time to find a better way, but I acknowledge
this is not the best. There is too much code duplication, which ironically was what
I was trying to avoid by duplicating the index.html template multiple times.

## Util.py
Any function in views.py that are not views are found in util.py in order to keep
views as lean as possible.

## Code Credits
Most code requiring credit is notated inline, but a few are not.

[Tweet-Box (HTML and CSS)](https://www.codingnepalweb.com/tweet-box-character-limit-highlighting-javascript/) - heavily modified
[Twitter HTML and CSS Template](https://github.com/jvadillo/twitter-bootstrap)


## Image Credits

[Man on Skyscraper](https://www.pexels.com/photo/alone-buildings-city-cityscape-220444/)
[Soldiers in Helicopter](https://www.pexels.com/photo/a-us-army-helicopter-hovering-above-a-group-of-soldiers-8079181/)
[Sunflowers](https://images.pexels.com/photos/54267/sunflower-blossom-bloom-flowers-54267.jpeg?cs=srgb&dl=pexels-pixabay-54267.jpg&fm=jpg)
[Cats](https://images.pexels.com/photos/4492163/pexels-photo-4492163.jpeg?cs=srgb&dl=pexels-aleksandr-nadyojin-4492163.jpg&fm=jpg)
[Chihuahua](https://images.pexels.com/photos/4378919/pexels-photo-4378919.jpeg?cs=srgb&dl=pexels-ellie-burgin-4378919.jpg&fm=jpg)
[Birds](https://images.pexels.com/photos/1435849/pexels-photo-1435849.jpeg?cs=srgb&dl=pexels-engin-akyurt-1435849.jpg&fm=jpg)






## License

[MIT](https://choosealicense.com/licenses/mit/)