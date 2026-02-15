#!/usr/bin/env python3
"""Generate all brand assets for Pariti from SVG sources."""

import os
import struct
import io
from pathlib import Path

import cairosvg
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

BRAND_DIR = Path(__file__).parent
ICON_SVG = BRAND_DIR / "icon" / "icon.svg"
FAVICON_DIR = BRAND_DIR / "favicon"
LOGO_DIR = BRAND_DIR / "logo"
SOCIAL_DIR = BRAND_DIR / "social"

# Brand colors
PRIMARY = "#1B365D"
ACCENT = "#22B8CF"
DARK = "#0A1628"
WHITE = "#FFFFFF"
TEXT_DARK = "#1E293B"
MUTED = "#64748B"
BG_LIGHT = "#F8FAFC"

# Font path
INTER_FONT = "/tmp/inter_font/InterVariable.ttf"
LIBERATION_FONT = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"


def get_font_path():
    """Return the best available font path."""
    if os.path.exists(INTER_FONT):
        return INTER_FONT
    return LIBERATION_FONT


def svg_to_png(svg_path_or_bytes, output_path, width, height):
    """Render SVG to PNG at exact pixel dimensions."""
    if isinstance(svg_path_or_bytes, (str, Path)):
        with open(svg_path_or_bytes, "rb") as f:
            svg_data = f.read()
    else:
        svg_data = svg_path_or_bytes

    png_data = cairosvg.svg2png(
        bytestring=svg_data,
        output_width=width,
        output_height=height,
    )
    img = Image.open(io.BytesIO(png_data))
    # Ensure exact dimensions
    if img.size != (width, height):
        img = img.resize((width, height), Image.LANCZOS)
    img.save(output_path, "PNG")
    return img


def generate_favicons():
    """Generate all favicon PNG files from SVG source."""
    print("Generating favicons...")

    sizes = {
        "favicon-16x16.png": (16, 16),
        "favicon-32x32.png": (32, 32),
    }

    for filename, (w, h) in sizes.items():
        output = FAVICON_DIR / filename
        svg_to_png(ICON_SVG, output, w, h)
        print(f"  Created {filename}")

    # Apple touch icon: 180x180 with padding on primary color background
    print("  Creating apple-touch-icon.png...")
    png_data = cairosvg.svg2png(
        url=str(ICON_SVG), output_width=140, output_height=140
    )
    icon_img = Image.open(io.BytesIO(png_data))

    apple = Image.new("RGBA", (180, 180), (27, 54, 93, 255))  # PRIMARY bg
    # Center the icon with padding
    offset = (180 - 140) // 2
    apple.paste(icon_img, (offset, offset), icon_img)
    apple.save(FAVICON_DIR / "apple-touch-icon.png", "PNG")

    # Android Chrome icons
    for size in [192, 512]:
        filename = f"android-chrome-{size}x{size}.png"
        output = FAVICON_DIR / filename
        svg_to_png(ICON_SVG, output, size, size)
        print(f"  Created {filename}")


def generate_favicon_ico():
    """Generate multi-resolution favicon.ico."""
    print("  Creating favicon.ico...")

    sizes = [16, 32, 48]
    images = []
    for size in sizes:
        png_data = cairosvg.svg2png(
            url=str(ICON_SVG), output_width=size, output_height=size
        )
        img = Image.open(io.BytesIO(png_data)).convert("RGBA")
        if img.size != (size, size):
            img = img.resize((size, size), Image.LANCZOS)
        images.append(img)

    # Save as ICO — Pillow writes all provided images into the ICO container
    images[0].save(
        FAVICON_DIR / "favicon.ico",
        format="ICO",
        append_images=images[1:],
    )


def generate_webmanifest():
    """Generate site.webmanifest file."""
    print("  Creating site.webmanifest...")

    manifest = """{
  "name": "Pariti",
  "short_name": "Pariti",
  "icons": [
    {
      "src": "android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#1B365D",
  "background_color": "#F8FAFC",
  "display": "standalone"
}
"""
    with open(FAVICON_DIR / "site.webmanifest", "w") as f:
        f.write(manifest)


def text_to_svg_paths(text, font_path, font_size=48):
    """Convert text to SVG path data using fontTools."""
    font = TTFont(font_path, fontNumber=0)
    cmap = font.getBestCmap()
    glyf = font.get("glyf") if "glyf" in font else None
    upem = font["head"].unitsPerEm
    scale = font_size / upem

    paths = []
    x_offset = 0

    # Get horizontal metrics
    hmtx = font["hmtx"]

    for char in text:
        glyph_id = cmap.get(ord(char))
        if glyph_id is None:
            # Use space advance
            x_offset += font_size * 0.3
            continue

        glyph_name = glyph_id if isinstance(glyph_id, str) else font.getGlyphName(glyph_id)
        advance_width = hmtx[glyph_name][0] * scale

        if glyf and glyph_name in glyf:
            glyph = glyf[glyph_name]
            if glyph.numberOfContours != 0:
                pen = SVGPathPen(font.getGlyphSet())
                font.getGlyphSet()[glyph_name].draw(pen)
                path_data = pen.getCommands()
                if path_data:
                    paths.append((x_offset, path_data, scale))

        x_offset += advance_width

    return paths, x_offset


def create_wordmark_svg(text, font_path, font_size, fill_color):
    """Create SVG path data for a wordmark."""
    try:
        paths, total_width = text_to_svg_paths(text, font_path, font_size)

        path_elements = []
        for x_off, path_data, scale in paths:
            # Transform: scale and flip Y (font coords are Y-up, SVG is Y-down)
            transform = f"translate({x_off:.1f}, {font_size:.1f}) scale({scale:.6f}, {-scale:.6f})"
            path_elements.append(
                f'<path d="{path_data}" fill="{fill_color}" transform="{transform}"/>'
            )

        return "\n    ".join(path_elements), total_width, font_size
    except Exception as e:
        print(f"  Warning: Font path extraction failed ({e}), using text element")
        return None, None, None


def generate_logo_horizontal(variant="color"):
    """Generate horizontal logo lockup."""
    is_dark = variant == "dark"
    bg_color = "none"
    text_fill = WHITE if is_dark else PRIMARY

    icon_size = 48
    font_size = 36
    gap = 16
    padding = 8

    # Try to generate wordmark paths
    font_path = get_font_path()
    path_result = create_wordmark_svg("Pariti", font_path, font_size, text_fill)

    icon_svg = f'''<g transform="translate({padding}, {padding})">
    <svg width="{icon_size}" height="{icon_size}" viewBox="0 0 64 64" fill="none">
      <circle cx="19" cy="19" r="11" fill="{PRIMARY if not is_dark else WHITE}"/>
      <circle cx="45" cy="19" r="11" fill="{PRIMARY if not is_dark else WHITE}"/>
      <circle cx="19" cy="45" r="11" fill="{PRIMARY if not is_dark else WHITE}"/>
      <circle cx="45" cy="45" r="11" fill="{ACCENT}"/>
      <path d="M39.5 45.5L43 49L51 41" stroke="{WHITE if not is_dark else DARK}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </g>'''

    text_x = padding + icon_size + gap
    text_y_center = padding + icon_size / 2

    if path_result[0] is not None:
        wordmark_paths, text_width, text_height = path_result
        text_y = text_y_center - text_height / 2
        text_element = f'<g transform="translate({text_x}, {text_y})">\n    {wordmark_paths}\n  </g>'
        total_width = text_x + text_width + padding
    else:
        text_element = f'<text x="{text_x}" y="{text_y_center + font_size * 0.35}" font-family="Inter, Liberation Sans, system-ui, sans-serif" font-size="{font_size}" font-weight="600" fill="{text_fill}">Pariti</text>'
        total_width = text_x + font_size * 3.5 + padding

    total_height = icon_size + padding * 2

    svg = f'''<svg width="{total_width:.0f}" height="{total_height}" viewBox="0 0 {total_width:.0f} {total_height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  {icon_svg}
  {text_element}
</svg>
'''

    suffix = "color" if not is_dark else "dark"
    output = LOGO_DIR / f"logo-horizontal-{suffix}.svg"
    with open(output, "w") as f:
        f.write(svg)
    print(f"  Created logo-horizontal-{suffix}.svg")


def generate_logo_stacked(variant="color"):
    """Generate stacked logo lockup."""
    is_dark = variant == "dark"
    text_fill = WHITE if is_dark else PRIMARY

    icon_size = 64
    font_size = 28
    gap = 12
    padding = 16

    icon_svg = f'''<g transform="translate({padding + 20}, {padding})">
    <svg width="{icon_size}" height="{icon_size}" viewBox="0 0 64 64" fill="none">
      <circle cx="19" cy="19" r="11" fill="{PRIMARY if not is_dark else WHITE}"/>
      <circle cx="45" cy="19" r="11" fill="{PRIMARY if not is_dark else WHITE}"/>
      <circle cx="19" cy="45" r="11" fill="{PRIMARY if not is_dark else WHITE}"/>
      <circle cx="45" cy="45" r="11" fill="{ACCENT}"/>
      <path d="M39.5 45.5L43 49L51 41" stroke="{WHITE if not is_dark else DARK}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </g>'''

    # Try font path extraction for stacked version
    font_path = get_font_path()
    path_result = create_wordmark_svg("Pariti", font_path, font_size, text_fill)

    text_y = padding + icon_size + gap

    if path_result[0] is not None:
        wordmark_paths, text_width, text_height = path_result
        total_width = max(icon_size + padding * 2 + 40, text_width + padding * 2)
        text_x = (total_width - text_width) / 2
        text_element = f'<g transform="translate({text_x:.1f}, {text_y})">\n    {wordmark_paths}\n  </g>'
        total_height = text_y + text_height + padding
    else:
        total_width = icon_size + padding * 2 + 40
        text_x = total_width / 2
        text_element = f'<text x="{text_x}" y="{text_y + font_size}" font-family="Inter, Liberation Sans, system-ui, sans-serif" font-size="{font_size}" font-weight="600" fill="{text_fill}" text-anchor="middle">Pariti</text>'
        total_height = text_y + font_size + padding + 8

    svg = f'''<svg width="{total_width:.0f}" height="{total_height:.0f}" viewBox="0 0 {total_width:.0f} {total_height:.0f}" fill="none" xmlns="http://www.w3.org/2000/svg">
  {icon_svg}
  {text_element}
</svg>
'''

    suffix = "color" if not is_dark else "dark"
    output = LOGO_DIR / f"logo-stacked-{suffix}.svg"
    with open(output, "w") as f:
        f.write(svg)
    print(f"  Created logo-stacked-{suffix}.svg")


def generate_og_image():
    """Generate Open Graph social preview image (1200x630)."""
    print("Generating OG image...")

    width, height = 1200, 630
    img = Image.new("RGB", (width, height), (248, 250, 252))  # BG_LIGHT
    draw = ImageDraw.Draw(img)

    # Draw a subtle top accent bar
    draw.rectangle([0, 0, width, 6], fill=(27, 54, 93))  # PRIMARY

    # Render the icon
    icon_size = 120
    png_data = cairosvg.svg2png(
        url=str(ICON_SVG), output_width=icon_size, output_height=icon_size
    )
    icon_img = Image.open(io.BytesIO(png_data))
    icon_x = (width - icon_size) // 2
    icon_y = 140
    img.paste(icon_img, (icon_x, icon_y), icon_img)

    # Load fonts
    font_path = get_font_path()
    try:
        font_title = ImageFont.truetype(font_path, 56)
        font_tagline = ImageFont.truetype(font_path, 22)
    except Exception:
        font_path = LIBERATION_FONT
        font_title = ImageFont.truetype(font_path, 56)
        font_tagline = ImageFont.truetype(font_path, 22)

    # Draw product name
    title = "Pariti"
    title_bbox = draw.textbbox((0, 0), title, font=font_title)
    title_w = title_bbox[2] - title_bbox[0]
    title_x = (width - title_w) // 2
    title_y = icon_y + icon_size + 40
    draw.text((title_x, title_y), title, fill=(27, 54, 93), font=font_title)

    # Draw tagline
    tagline = "Venture Capital Demographic Compliance, Simplified"
    tag_bbox = draw.textbbox((0, 0), tagline, font=font_tagline)
    tag_w = tag_bbox[2] - tag_bbox[0]
    tag_x = (width - tag_w) // 2
    tag_y = title_y + 80
    draw.text((tag_x, tag_y), tagline, fill=(100, 116, 139), font=font_tagline)

    # Bottom accent line
    draw.rectangle([0, height - 4, width, height], fill=(34, 184, 207))  # ACCENT

    img.save(SOCIAL_DIR / "og-image.png", "PNG", quality=95)
    print("  Created og-image.png")


def main():
    print("=" * 50)
    print("Pariti Brand Asset Generator")
    print("=" * 50)

    # Ensure directories exist
    for d in [FAVICON_DIR, LOGO_DIR, SOCIAL_DIR]:
        d.mkdir(parents=True, exist_ok=True)

    # 1. Favicons
    generate_favicons()
    generate_favicon_ico()
    generate_webmanifest()

    # 2. Logo lockups
    print("\nGenerating logo lockups...")
    generate_logo_horizontal("color")
    generate_logo_horizontal("dark")
    generate_logo_stacked("color")
    generate_logo_stacked("dark")

    # 3. OG Image
    print()
    generate_og_image()

    print("\n" + "=" * 50)
    print("All assets generated successfully!")
    print("=" * 50)


if __name__ == "__main__":
    main()
