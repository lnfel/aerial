<p align="center">
    <a href="https://lnfel.github.io/lamy-debugbar/" target="_blank">
        <img src="https://raw.githubusercontent.com/lnfel/kmeans_colors/main/static/favicon.png" height="150">
    </a>
    <h1 align="center">Aerial</h1>
</p>

## About

Aerial is an sveltekit application that extracts dominant colors from images and documents (mainly docx and pdf format) and displays the summary on the client. The core functionality relies heavily on [kmeans_colors](https://github.com/okaneco/kmeans-colors), a k-means clustering library written in Rust.

## Supported files

Aerial can extract colors in most image formats:
- [x] JPEG
- [x] PNG
- [x] GIF
- [x] SVG (only when no embedded fonts)
- [x] TIFF (rendering is experimental but colors can be extracted)
- [x] WebP

It can process the following document formats:
- [x] DOCX
- [x] PDF

## Pre-requisites

The following applications must be installed in order for Aerial to run without issues:

- [Node.js](https://nodejs.org/en/download) version 18+ (Aerial's core functionality requires it to run sveltekit with a backend server)
- [Libreoffice](https://www.libreoffice.org/download/download-libreoffice/) tested using version 7.3.7.2 30(Build:2) with [ubuntu](https://wiki.ubuntu.com/LibreOffice) (required for processing docx files)

> Note: Aerial uses kmeans_colors compiled rust binary so we don't need to install the Rust compiler, Aerial should work on development or production server without rust installed.
> Source: [/r/rust Reddit thread](https://www.reddit.com/r/rust/comments/wjubpl/comment/ijjz2hv/?utm_source=share&utm_medium=web2x&context=3)

## Getting Started


