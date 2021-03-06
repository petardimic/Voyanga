<?php
/**
 * Created by JetBrains PhpStorm.
 * User: oleg
 * Date: 16.07.12
 * Time: 12:37
 * To change this template use File | Settings | File Templates.
 */
class SWLogActiveRecord extends SWActiveRecord
{
    public static $requestIds = array();

    public function beforeTransition($event)
    {
        //VarDumper::dump($event);
        $transition = array();
        $transition['type'] = 'before';
        $transition['modelName'] = get_class($event->sender);
        $transition['modelId'] = $event->sender->primaryKey;
        $transition['stateFrom'] = $event->source->getId();
        $transition['stateTo'] = $event->destination->getId();
        $transition['time'] = date('Y-m-d H:i:s');
        $transition['requestIds'] = SWLogActiveRecord::$requestIds;
        SWLogActiveRecord::$requestIds = array();
        //VarDumper::dump($transition);
        //self::$requestIds;
        WorkflowStates::setTransition($transition);
        return parent::beforeTransition($event);
    }

    public function afterTransition($event)
    {
        $transition = array();
        $transition['type'] = 'after';
        $transition['modelName'] = get_class($event->sender);
        $transition['modelId'] = $event->sender->primaryKey;
        $transition['stateFrom'] = $event->source->getId();
        $transition['stateTo'] = $event->destination->getId();
        $transition['time'] = date('Y-m-d H:i:s');
        $transition['requestIds'] = SWLogActiveRecord::$requestIds;
        SWLogActiveRecord::$requestIds = array();
        //VarDumper::dump($transition);
        WorkflowStates::setTransition($transition);
        return parent::beforeTransition($event);
    }

    public function onAfterSave($event)
    {
        //CVarDumper::dump(get_class_vars(get_class($event->sender)));
        $transition = array();
        $transition['type'] = 'afterSave';
        $transition['modelName'] = get_class($event->sender);
        $transition['modelId'] = $event->sender->primaryKey;
        $transition['state'] = $event->sender->{$this->statusAttribute};
        $transition['time'] = date('Y-m-d H:i:s');
        $transition['requestIds'] = SWLogActiveRecord::$requestIds;
        SWLogActiveRecord::$requestIds = array();
        //CVarDumper::dump($transition);

        WorkflowStates::setTransition($transition);
        //return parent::afterSave();
    }

}
