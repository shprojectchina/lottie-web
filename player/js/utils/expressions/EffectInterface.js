var EffectsExpressionInterface = (function (){
    var ob = {
        createEffectsInterface: createEffectsInterface
    };

    function createEffectsInterface(elem, propertyGroup){
        if(elem.effects){

            var effectElements = [];
            var effectsData = elem.data.ef;
            var i, len = elem.effects.effectElements.length;
            for(i=0;i<len;i+=1){
                effectElements.push(createGroupInterface(effectsData[i],elem.effects.effectElements[i],propertyGroup,elem));
            }

            return function(name){
                var effects = elem.data.ef, i = 0, len = effects.length;
                while(i<len) {
                    if(name === effects[i].nm || name === effects[i].mn || name === effects[i].ix){
                        return effectElements[i];
                    }
                    i += 1;
                }
            }
        }
    }

    function createGroupInterface(data,elements, propertyGroup, elem){
        var effectElements = [];
        var i, len = data.ef.length;
        for(i=0;i<len;i+=1){
            if(data.ef[i].ty === 5){
                effectElements.push(createGroupInterface(data.ef[i],elements.effectElements[i],elements.effectElements[i].propertyGroup, elem));
            } else {
                effectElements.push(createValueInterface(elements.effectElements[i],data.ef[i].ty, elem, propertyGroup));
            }
        }
        var groupInterface = function(name){
            var effects = data.ef, i = 0, len = effects.length;
            while(i<len) {
                if(name === effects[i].nm || name === effects[i].mn || name === effects[i].ix){
                    if(effects[i].ty === 5){
                        return effectElements[i];
                    } else {
                        return effectElements[i]();
                    }
                }
                i += 1;
            }
            return effectElements[0]();
        }

        groupInterface.propertyGroup = function(val){
           if(val === 1){
               return interfaceFunction;
           } else{
               return propertyGroup(val-1);
           }
        };

        if(data.mn === 'ADBE Color Control'){
            Object.defineProperty(groupInterface, 'color', {
                get: function(){
                    return effectElements[0]();
                }
            });
        }
        Object.defineProperty(groupInterface, 'numProperties', {
            get: function(){
                return data.np;
            }
        });
        groupInterface.active = data.en !== 0;
        return groupInterface
    }

    function createValueInterface(element, type, elem, propertyGroup){
        function interfaceFunction(){
            if(type === 10){
                return elem.comp.compInterface(element.p.v);
            }
            return ExpressionValue(element.p);
        }

        function _propertyGroup(val){
            if(val == 1){
                return interfaceFunction;
            } else {
                return propertyGroup(--val);
            }
        }

        element.p.setGroupProperty(_propertyGroup);

        return interfaceFunction;
    }

    return ob;

}());