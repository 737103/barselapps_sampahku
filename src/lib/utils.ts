import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function compressImage(file: File, maxWidth: number, maxHeight: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Get the data-URL with the specified type and quality
        const dataUrl = canvas.toDataURL(file.type, 0.7); // 70% quality
        resolve(dataUrl);
      };
      img.onerror = (error) => {
        reject(error);
      }
    }
    reader.onerror = (error) => {
      reject(error);
    }
  });
}


export function terbilang(n: number): string {
    if (n < 0) return `minus ${terbilang(Math.abs(n))}`;

    const bilangan = [
        "", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"
    ];

    let temp = "";
    if (n < 12) {
        temp = ` ${bilangan[n]}`;
    } else if (n < 20) {
        temp = `${terbilang(n - 10)} belas`;
    } else if (n < 100) {
        temp = `${terbilang(Math.floor(n / 10))} puluh${terbilang(n % 10)}`;
    } else if (n < 200) {
        temp = ` seratus${terbilang(n - 100)}`;
    } else if (n < 1000) {
        temp = `${terbilang(Math.floor(n / 100))} ratus${terbilang(n % 100)}`;
    } else if (n < 2000) {
        temp = ` seribu${terbilang(n - 1000)}`;
    } else if (n < 1000000) {
        temp = `${terbilang(Math.floor(n / 1000))} ribu${terbilang(n % 1000)}`;
    } else if (n < 1000000000) {
        temp = `${terbilang(Math.floor(n / 1000000))} juta${terbilang(n % 1000000)}`;
    } else if (n < 1000000000000) {
        temp = `${terbilang(Math.floor(n / 1000000000))} milyar${terbilang(n % 1000000000)}`;
    } else if (n < 1000000000000000) {
        temp = `${terbilang(Math.floor(n / 1000000000000))} trilyun${terbilang(n % 1000000000000)}`;
    }
    
    // Capitalize first letter and trim leading/trailing spaces
    const result = temp.trim();
    return result.charAt(0).toUpperCase() + result.slice(1);
}
