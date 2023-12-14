var join = function(arr1, arr2) {
    let map = new Map()
    arr1.forEach((obj)=>{
        map.set(obj.id, obj)
    })

    arr2.forEach((obj)=>{
        if(!map.has(obj.id)) map.set(obj.id,obj)
        else{
            dup = map.get(obj.id)
            for(key in obj){
                dup[key]=obj[key]
            }
            map.set(obj.id,dup)
        }
    })    
    return [...map.values()].sort((a,b)=>a.id-b.id)
};
