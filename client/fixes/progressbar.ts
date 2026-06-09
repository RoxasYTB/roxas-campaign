var progressBars: Record<
	string,
	{ title: string; percent: number } | undefined
> = {};
var progressLeft: number = PROGRESS_LEFT;
var progressTop: number = PROGRESS_TOP;
var progressWidth: number = PROGRESS_WIDTH;
var progressHeight: number = PROGRESS_HEIGHT;
var progressSpacing: number = PROGRESS_SPACING;
var progressMargin: number = PROGRESS_MARGIN;
var progressFontSize: number = PROGRESS_FONT_SIZE;
var progressTextYOffset: number = PROGRESS_TEXT_Y_OFFSET;
var progressBgColour: number = PROGRESS_BG_COLOUR;
var progressFgColour: number = PROGRESS_FG_COLOUR;
var progressShadowColour: number = PROGRESS_SHADOW_COLOUR;
var progressBarY: Record<string, number | undefined> = {};
var _progressFont: Font | null = null;
var _fontPath: string = "pricedownbl.ttf";

function _loadFont(size: number): void {
	try {
		if (openFile) {
			var s: ReturnType<typeof openFile> = openFile(_fontPath);
			if (s) {
				_progressFont = lucasFont.createFont(s, size);
				s.close();
			}
		}
	} catch (_e) {
		_progressFont = null;
	}
}

bindEventHandler(
	"OnResourceReady",
	thisResource,
	(_event: unknown, _resource: unknown) => {
		_loadFont(progressFontSize);
	}
);

addNetworkHandler(
	"setProgressBar",
	(barId: string, title: string, percent: number) => {
		if (percent === undefined) {
			delete progressBars[barId];
		} else {
			progressBars[barId] = {
				title: title,
				percent: Math.max(0, Math.min(100, percent)),
			};
		}
	}
);

addNetworkHandler("setProgressText", (barId: string, title: string) => {
	if (progressBars[barId]) {
		progressBars[barId].title = title;
	}
});

addNetworkHandler("progressSetPos", (left: number, top: number) => {
	if (left !== undefined) {
		progressLeft = left;
	}
	if (top !== undefined) {
		progressTop = top;
	}
});

addNetworkHandler("progressSetSize", (width: number, height: number) => {
	if (width !== undefined) {
		progressWidth = width;
	}
	if (height !== undefined) {
		progressHeight = height;
	}
});

addNetworkHandler("progressSetMargin", (margin: number) => {
	progressMargin = margin;
});

addNetworkHandler("progressSetFontSize", (size: number) => {
	progressFontSize = size;
	_loadFont(size);
});

addNetworkHandler("progressSetTextY", (offset: number) => {
	progressTextYOffset = offset;
});

addEventHandler("OnBeforeDrawHUD", () => {
	var ids: string[] = Object.keys(progressBars);
	if (ids.length === 0) {
		return;
	}

	var w: number = typeof gta.width === "number" ? gta.width : PROGRESS_DEFAULT_WIDTH;
	var centre: Vec2 = new Vec2(0, 0);
	var src: Vec2 = new Vec2(0, 0);
	var startX: number = w - progressWidth - progressLeft;

	for (var i = 0; i < ids.length; i++) {
		var bar: { title: string; percent: number } | undefined =
			progressBars[ids[i]];
		if (!bar) {
			continue;
		}
		var barY: number | undefined = progressBarY[ids[i]];
		var y: number =
			barY === undefined ? progressTop + i * progressSpacing : barY;
		var pct: number = Math.min(1, Math.max(0, bar.percent / 100.0));

		if (_progressFont) {
			var tx: number = startX - progressMargin;
			var ty: number = y + progressTextYOffset;
			var title: string = bar.title;

			var maxH: number = 0;
			var measures: Vec2[] = [];
			for (var ci = 0; ci < title.length; ci++) {
				var m: Vec2 = _progressFont.measure(
					title.charAt(ci),
					0,
					0.0,
					0.0,
					progressFontSize
				);
				measures.push(m);
				if (m.y > maxH) {
					maxH = m.y;
				}
			}

			for (ci = 0; ci < title.length; ci++) {
				m = measures[ci];
				var pos: Vec2 = new Vec2(tx, ty + maxH - m.y);
				_progressFont.render(
					title.charAt(ci),
					new Vec2(tx + PROGRESS_SHADOW_OFFSET_X, ty + maxH - m.y + PROGRESS_SHADOW_OFFSET_Y),
					0,
					0.0,
					0.0,
					progressFontSize,
					progressShadowColour
				);
				_progressFont.render(
					title.charAt(ci),
					pos,
					0,
					0.0,
					0.0,
					progressFontSize,
					progressFgColour
				);
				tx += m.x;
			}
		}

		gta.drawRectangle(
			null,
			new Vec2(startX + PROGRESS_SHADOW_OFFSET_X, y + PROGRESS_SHADOW_OFFSET_Y),
			new Vec2(progressWidth, progressHeight),
			centre,
			0.0,
			progressShadowColour,
			src,
			src
		);
		gta.drawRectangle(
			null,
			new Vec2(startX, y),
			new Vec2(progressWidth, progressHeight),
			centre,
			0.0,
			progressBgColour,
			src,
			src
		);
		if (pct > 0) {
			gta.drawRectangle(
				null,
				new Vec2(startX, y),
				new Vec2(progressWidth * pct, progressHeight),
				centre,
				0.0,
				progressFgColour,
				src,
				src
			);
		}
	}
});
