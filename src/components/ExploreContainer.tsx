import './ExploreContainer.css';
import {TastyApiService} from "../services/tasty-api.service";

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
    const fetchData = async () => {
        const data = await TastyApiService.Instance.getEquityData('NVDA', 'AAPL');
        console.log(data);
    }

    return (
        <div id="container">
            <strong>{name}</strong>
            <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI
                Components</a></p>
            <button onClick={fetchData}>
                Fetch data
            </button>
        </div>
    );
};

export default ExploreContainer;
