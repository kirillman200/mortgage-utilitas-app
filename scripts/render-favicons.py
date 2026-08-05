from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"

INK = "#122633"
PAPER = "#fffaf0"
GOLD = "#f3b94f"


def render_icon(size: int) -> Image.Image:
    scale = 8
    canvas_size = size * scale
    ratio = canvas_size / 64
    image = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    def points(values):
        return [(round(x * ratio), round(y * ratio)) for x, y in values]

    draw.rounded_rectangle(
        (0, 0, canvas_size - 1, canvas_size - 1),
        radius=round(16 * ratio),
        fill=INK,
    )
    draw.polygon(
        points(
            [
                (10, 31),
                (32, 11),
                (54, 31),
                (54, 53),
                (39, 53),
                (39, 39),
                (25, 39),
                (25, 53),
                (10, 53),
            ]
        ),
        fill=PAPER,
    )
    draw.line(
        points([(18, 25), (18, 13), (27, 13), (27, 17)]),
        fill=GOLD,
        width=max(1, round(4 * ratio)),
        joint="curve",
    )

    return image.resize((size, size), Image.Resampling.LANCZOS)


def main() -> None:
    render_icon(32).save(PUBLIC / "favicon-32.png", optimize=True)
    render_icon(180).save(PUBLIC / "apple-touch-icon.png", optimize=True)
    render_icon(192).save(PUBLIC / "favicon-192.png", optimize=True)
    render_icon(512).save(PUBLIC / "favicon-512.png", optimize=True)

    render_icon(48).save(
        PUBLIC / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )


if __name__ == "__main__":
    main()