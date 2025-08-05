import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
    selector:'app-section3',
    standalone:true,
    imports:[CommonModule],
    templateUrl:"./section3.component.html",
    styleUrl:"./section3.component.css",
})

export class Section3Component{
    result:boolean = false;
    setFalse(){
        this.result = false;
    }
    setTrue(){
        this.result = true;
    }
    playVideo(video: HTMLVideoElement){
        video.play();
    }
}