import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App implements OnInit {
    protected readonly title = signal('ichi-loop');

    ngOnInit(): void {
        window.onload = async () => { //triger when every thing is load (files, assets, components' resolver, etc)

            await new Promise((resolve) => setTimeout(resolve, 500));
            const splashElement = document.querySelector(".splash-screen-container") as HTMLElement;
            if (!splashElement) {
                return;
            }
            // All good so add clas "splashScreenFade" to hide the splash screen slowly 
            splashElement.classList.add("fade");
            splashElement.addEventListener('transitionend', (e) => {
                splashElement.style.display = 'none'
            });
        }
    }
}
