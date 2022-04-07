# Grub Tune Tester

[**GTT**](https://breadmaker.github.io/grub-tune-tester/) is an online tool to test your `GRUB_INIT_TUNE` beforehand.

## How to use

Just enter a `GRUB_INIT_TUNE` using the following format:

`tempo freq duration [freq duration freq duration...]`

Where:

 - `tempo` is the base time for all note durations, as beats per minute. 60 means 1 second notes. 120 means 0.5s notes, etc.
 - `freq` is the first part of a note. Indicates its frequency in hertz. 262 is a Middle C. 0 means silence.
 - `duration` is the second part of a note. Indicates its duration measured in bars. With a tempo of 60, 1 means a one second note, 2 means a two seconds note.

## In need of ideas?

Check [this gist](https://gist.github.com/ArtBIT/cfb030c0791b42330381acce33f82ca0) for ideas & cool tunes. Thanks to [@jtagcat](https://github.com/jtagcat) for [the suggestion](https://github.com/BreadMaker/grub-tune-tester/issues/8).

## How to help

You can help by reporting bugs, suggesting functionalities or contributing with
new tunes [over here](https://github.com/BreadMaker/grub-tune-tester/issues/new).
