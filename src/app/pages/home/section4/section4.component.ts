import { Component } from "@angular/core";

@Component({
    selector:"app-section4",
    standalone:true,
    templateUrl:"./section4.component.html",
    styleUrl:"./section4.component.css",
    imports:[],
})

export class Section4Component{
    feature = [
        {
            id:1,
            icon:"./assets/feature/feature-1.png",
            title:"Swimming Pool"
        },
        {
            id:2,
            icon:"./assets/feature/feature-2.png",
            title:"Hotel Teller",
        },
        {
            id:3,
            icon:"./assets/feature/feature-3.png",
            title:"Fire Exit",
        },
        {
            id:4,
            icon:"./assets/feature/feature-4.png",
            title:"Car Parking",
        },
        {
            id:5,
            icon:"./assets/feature/feature-5.png",
            title:"Hair Dryer",
        },
        {
            id:6,
            icon:"./assets/feature/feature-6.png",
            title:"Minibar",
        },
        {
            id:7,
            icon:"./assets/feature/feature-7.png",
            title:"Drinks",
        },
        {
            id:8,
            icon:"./assets/feature/feature-8.png",
            title:"Car Airport",
        },
    ];
    
}