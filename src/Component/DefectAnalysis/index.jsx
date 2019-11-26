import React from 'react';

function DefectAnalysis (props){
    function Comparator(a, b) {
        if (a[1] > b[1]) return -1;
        if (a[1] < b[1]) return 1;
        return 0;
      }
      
    return (
        <div className="defect-container">
            {props.data.sort(Comparator).map((item, index) => <div key={index} className="defect-container-details"><div className="defect-name">{item[0].match(/[A-Z][a-z]+|[0-9]+/g).join(" ").slice(0,-5)}</div><div className="defect-width"><div className="defect-width-value" style={{width:(item[1] === undefined ? 0 : item[1])+'%'}}></div></div><div className="defect-value">{item[1] === undefined ? 0 : item[1]}</div></div>)}
        </div>
    )
}

export default DefectAnalysis;