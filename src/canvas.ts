interface ICanvasOptions {
    width: number;
    height: number;
    parent?: HTMLElement;
    backgroundColor?: string;
}

interface IStyleOptions {
    fillStyle?: string;
    strokeStyle?: string;
    lineWidth?: number;
}

export class Canvas {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    width: number;
    height: number;

    constructor({ width, height, parent = document.body, backgroundColor = '#ffffff' }: ICanvasOptions) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d')!;
        this.width = width;
        this.height = height;

        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.backgroundColor = backgroundColor;

        parent.appendChild(this.canvas);
    }

    public clear(color: string = '#ffffff'): void {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.width, this.height);
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public getContext(): CanvasRenderingContext2D {
        return this.context;
    }

    public resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }

    public destroy(): void {
        this.canvas.remove();
    }

    private applyStyles(styles?: IStyleOptions): void {
        if (!styles) return;
        if (styles.fillStyle !== undefined) this.context.fillStyle = styles.fillStyle;
        if (styles.strokeStyle !== undefined) this.context.strokeStyle = styles.strokeStyle;
        if (styles.lineWidth !== undefined) this.context.lineWidth = styles.lineWidth;
    }

    public drawRect(x: number, y: number, width: number, height: number, styles?: IStyleOptions): void {
        this.applyStyles(styles);
        if (styles?.fillStyle) this.context.fillRect(x, y, width, height);
        if (styles?.strokeStyle) this.context.strokeRect(x, y, width, height);
    }

    public drawCircle(x: number, y: number, radius: number, styles?: IStyleOptions): void {
        this.applyStyles(styles);
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, Math.PI * 2);
        if (styles?.fillStyle) this.context.fill();
        if (styles?.strokeStyle) this.context.stroke();
    }

    public drawLine(x1: number, y1: number, x2: number, y2: number, styles?: IStyleOptions): void {
        this.applyStyles(styles);
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
    }
}

// Usage Example (outside of class definition)
