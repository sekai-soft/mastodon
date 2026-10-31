# frozen_string_literal: true

# Adapted from https://github.com/pill-city/pill-city/blob/a68f58893a83709e77af128743b01e5de4a67e2e/web/src/utils/parseContent.js#L3
class GooglePlusTextFormatter
  # <p> is the Mastodon text start, </p> is the Mastodon text end
  G_PLUS_STRIKE_THROUGH = /(^|\s|<p>)-(.+?)-($|\s|<\/p>)/
  G_PLUS_ITALIC = /(^|\s|<p>)_(.+?)_($|\s|<\/p>)/
  G_PLUS_BOLD = /(^|\s|<p>)\*(.+?)\*($|\s|<\/p>)/

  MASTODON_NEW_LINE = '<br />'

  def call(html)
    html
      .split(MASTODON_NEW_LINE)
      .map do |line|
        line
          .gsub(G_PLUS_STRIKE_THROUGH, '\1<del>\2</del>\3')
          .gsub(G_PLUS_ITALIC, '\1<i>\2</i>\3')
          .gsub(G_PLUS_BOLD, '\1<b>\2</b>\3')
      end
      .join(MASTODON_NEW_LINE)
  end
end
