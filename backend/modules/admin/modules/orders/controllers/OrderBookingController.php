<?php
/**
 * Created by JetBrains PhpStorm.
 * User: oleg
 * Date: 19.07.12
 * Time: 12:18
 * To change this template use File | Settings | File Templates.
 */
class OrderBookingController extends Controller
{

    /**
     * Displays a particular model.
     * @param integer $id the ID of the model to be displayed
     */
    public function actionView($id)
    {
        $this->render('item',array(
            'data'=>$this->getOrderInfo($id),
        ));
    }

    /**
     * Lists all models.
     */
    public function actionIndex($all=false)
    {
        $criteria = array('order'=>'t.timestamp DESC');
        $navText = 'Показать без мусора';
        $navLink = $this->createUrl('index');

        if(!$all) {
            $criteria['with'] = array('hotelBookers', 'flightBookers');
            $criteria['together'] = true;
            $criteria['condition'] = "hotelBookers.status!='swHotelBooker/enterCredentials' or flightBookers.status!='swFlightBooker/enterCredentials'";
            $navText = 'Показать все';
            $navLink = $this->createUrl('index', array('all'=>true));
        }

        if(isset($_GET['search'])) {
            $s = $_GET['search'];
            $criteria['with'] = array('hotelBookers', 'flightBookers');
            $criteria['together'] = true;
            $conds = Array();
            $conds[] = "flightBookers.nemoBookId = '$s'";  
            $conds[] = "flightBookers.pnr = '$s'";
            $conds[] = "email='$s'";
            $criteria['condition'] = implode(" OR ", $conds);

        }


        //$dataProvider=new EMongoDocumentDataProvider('GeoNames',array('criteria'=>array('conditions'=>array('iataCode'=>array('type'=>2)) )));
        //$dataProvider=new EMongoDocumentDataProvider('GeoNames',array('criteria'=>array('conditions'=>array('iataCode'=>array('type'=>2)) )));
        $dataProvider=new CActiveDataProvider('OrderBooking', array(
            'criteria'=>$criteria,
            'pagination'=>array(
                'pageSize'=>10,
            )
        ));
        $this->render('index',array(
            'dataProvider'=>$dataProvider,
            'navText' => $navText,
            'navLink' => $navLink,
        ));
    }

    public function actionGetInfo($id)
    {
        /** @var OrderBooking $model  */
        $model = $this->loadModel($id);

        $retArr = $model->attributes;
        $retArr['userDescription'] = $model->userDescription;
        $retArr['bookings'] = array();

        foreach($model->flightBookers as $flightBooker){
            $booking = array();
            $booking['status'] = $model->stateAdapter($flightBooker->status);
            $booking['type'] = 'Авиа';
            $booking['className'] = get_class($flightBooker);
            $booking['modelId'] = $flightBooker->id;
            $booking['description'] = $flightBooker->fullDescription;

            if($flightBooker->price){
                $booking['price'] = $flightBooker->price;
            }
            else
            {
                if($flightBooker->flightVoyage->price){
                    $booking['price'] = $flightBooker->flightVoyage->price;
                }
            }
            //! FIXME use YII urlgen
            $wfStates = WorkflowStates::model()->findByAttributes(array('className'=>'FlightBooker', 'objectId'=>$flightBooker->id));
            if(count($wfStates)==1)
            {
                $booking['wfUrl'] = '/admin/logging/workflowStates#'.$wfStates->_id;
            }

            $retArr['bookings'][] = $booking;
        }

        foreach($model->hotelBookers as $hotelBooker){
            $booking = array();
            $booking['status'] = $model->stateAdapter($hotelBooker->status);
            $booking['type'] = 'Отель';
            $booking['description'] = $hotelBooker->fullDescription;
            if($hotelBooker->price){
                $booking['price'] = $hotelBooker->price;
            }
            else
            {
                if(isset($hotelBooker->hotel)){
                    if(isset($hotelBooker->hotel->rubPrice)){
                        $booking['price'] = $hotelBooker->hotel->rubPrice;
                    }
                }
            }
            //! FIXME use YII urlgen
            $wfStates = WorkflowStates::model()->findByAttributes(array('className'=>'HotelBooker', 'objectId'=>$hotelBooker->id));
            if(count($wfStates)==1)
            {
                $booking['wfUrl'] = '/admin/logging/workflowStates#'.$wfStates->_id;
            }

            $retArr['bookings'][] = $booking;
        }

        echo json_encode($retArr);
    }

    private function getOrderInfo($id)
    {
        /** @var OrderBooking $model  */
        $model = $this->loadModel($id);

        $retArr = $model->attributes;
        $retArr['orderBooking'] = $model;
        $retArr['userDescription'] = $model->userDescription;
        $retArr['flightBookings'] = array();
        $retArr['hotelBookings'] = array();

        foreach($model->flightBookers as $flightBooker) {
            $retArr['flightBookings'][] = $flightBooker;
        }

        foreach($model->hotelBookers as $hotelBooker){
            $retArr['hotelBookings'][] = $hotelBooker;
        }
        return $retArr;
    }


    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer the ID of the model to be loaded
     */
    public function loadModel($id)
    {
        $model=OrderBooking::model()->findByPk($id);

        if($model===null)
            throw new CHttpException(404,'The requested page does not exist.');
        return $model;
    }

}
