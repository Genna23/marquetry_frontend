export default function getPictureValues({filename, alt}) {

    const [, witdh, height] = filename.match(/\/(\d+)x(\d+)\//)

    return {
        src: filename,
        alt,
        width: witdh+'px',
        height: height+'px'
    }
}