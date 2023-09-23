// Adapted from https://github.com/pill-city/pill-city/blob/a68f58893a83709e77af128743b01e5de4a67e2e/web/src/utils/parseContent.js#L3
// <p> is the Mastodon text start, </p> is the Mastodon text end
const GPlusStrikeThrough = /(^|\s|<p>)-(.+?)-($|\s|<\/p>)/gm
// const GPlusItalic = /(^|\s|<p>)_(.+?)_($|\s|<\/p>)/gm
// const GPlusBold = /(^|\s|<p>)\*(.+?)\*($|\s|<\/p>)/gm

const MastodonNewLine = '<br />'

const parseGPlusFormatting = (contentHtml) => {
  return contentHtml
    .split(MastodonNewLine)
    .map(line => {
        return line
          .replace(GPlusStrikeThrough, '$1<del>$2</del>$3')
          // .replace(GPlusItalic, "$1<i>$2</i>$3")
          // .replace(GPlusBold, '$1<b>$2</b>$3')
    })
    .join(MastodonNewLine)
}

export default parseGPlusFormatting
