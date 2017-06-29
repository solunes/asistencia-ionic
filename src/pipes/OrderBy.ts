import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'orderBy', pure: false})
export class OrderByPipe implements PipeTransform {

	value:string[] =[];

    transform(input:any, config:string = '-'): any {

        //invalid input given

        if(!input) return input;

    	//make a copy of the input's reference
    	this.value = [...input];
    	let value = this.value;
        
        if(!Array.isArray(value)) return value;

        let desc = config.substr(0, 1) == '-';
            
        //Basic array
        if(config == '-' || config == '+'){
            return !desc ? value.sort() : value.sort().reverse();
        }
    }
}
